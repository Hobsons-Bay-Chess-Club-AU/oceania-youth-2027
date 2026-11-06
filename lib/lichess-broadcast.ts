import { Chess } from "chess.js";

export type BroadcastTournament = { id: string; url: string };
export type BroadcastPosition = {
  fen: string; san?: string; color?: "w" | "b"; moveNumber?: number;
  from?: string; to?: string; whiteClock?: string; blackClock?: string; comment?: string;
};
export type BroadcastGame = {
  id: string; headers: Record<string, string>; tournamentName: string;
  round: string; roundGroup: string; board: string; pgn: string; positions: BroadcastPosition[];
};

export function parseTournamentConfig(value = "") {
  const ids = [...new Set(value.split(",").map(id => id.trim()).filter(Boolean))];
  return {
    tournaments: ids.filter(id => /^[a-zA-Z0-9]{8}$/.test(id)).map(id => ({
      id, url: `https://lichess.org/api/broadcast/${id}.pgn`,
    })),
    invalidIds: ids.filter(id => !/^[a-zA-Z0-9]{8}$/.test(id)),
  };
}

// Split only at real tag sections, never at header-like text inside comments.
function splitPgn(pgn: string) {
  const blocks: string[] = [];
  let lines: string[] = [];
  let inComment = false;
  for (const line of pgn.replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n").split("\n")) {
    if (!inComment && /^\s*\[Event\s+"/.test(line) && lines.some(value => value.trim())) {
      blocks.push(lines.join("\n").trim());
      lines = [];
    }
    lines.push(line);
    if (!inComment && /^\s*\[/.test(line)) continue;
    for (const char of line) {
      if (!inComment && char === ";") break;
      if (char === "{") inComment = true;
      if (char === "}") inComment = false;
    }
  }
  if (lines.some(line => line.trim())) blocks.push(lines.join("\n").trim());
  return blocks;
}

export function parseBroadcastPgn(pgn: string) {
  const games: BroadcastGame[] = [];
  const errors: string[] = [];
  if (!pgn.trim()) return { games, errors };
  if (!/^\s*\[\w+\s+"/u.test(pgn.replace(/^\uFEFF/, ""))) {
    throw new Error("The broadcast did not return valid PGN data.");
  }
  splitPgn(pgn).forEach((block, index) => {
    try {
      const variant = block.match(/^\[Variant\s+"([^"]+)"\]/m)?.[1];
      if (variant && !["standard", "rapid", "blitz", "from position", "chess"].includes(variant.trim().toLowerCase())) {
        throw new Error(`Unsupported variant: ${variant}`);
      }
      const chess = new Chess();
      // Lichess can emit several comments after one move; chess.js accepts one.
      // Match quoted tags and semicolon comments first so their contents stay intact.
      const compatiblePgn = block.replace(/"(?:\\.|[^"\\])*"|;[^\n]*|\{[^}]*\}(?:\s*\{[^}]*\})+/g,
        text => text.startsWith("{") ? text.replace(/}\s*{/g, " ") : text);
      chess.loadPgn(compatiblePgn);
      const headers = chess.getHeaders();
      const history = chess.history({ verbose: true });
      const comments = new Map(chess.getComments().map(comment => [comment.fen, comment.comment]));
      const positions: BroadcastPosition[] = [{ fen: history[0]?.before || chess.fen() }];
      let whiteClock: string | undefined;
      let blackClock: string | undefined;
      for (const move of history) {
        const comment = comments.get(move.after);
        const clock = comment?.match(/\[%clk\s+(\d+:\d{2}:\d{2}(?:\.\d+)?)\s*\]/)?.[1];
        if (clock && move.color === "w") whiteClock = clock;
        if (clock && move.color === "b") blackClock = clock;
        positions.push({
          fen: move.after, san: move.san, color: move.color,
          moveNumber: Number(move.before.split(" ")[5]), from: move.from, to: move.to,
          whiteClock, blackClock,
          comment: comment?.replace(/\[%(?:clk|eval|emt)\s+[^\]]*\]/g, "").trim() || undefined,
        });
      }
      const round = headers.Round || "Unspecified";
      const roundBoard = round.match(/^(\d+)\.(\d+)$/);
      games.push({
        id: headers.GameURL || JSON.stringify([headers.Event, headers.Date, round, headers.White, headers.Black, headers.FEN]),
        headers, tournamentName: headers.BroadcastName || headers.Event || "Tournament",
        round, roundGroup: roundBoard?.[1] || round,
        board: headers.Board || roundBoard?.[2] || String(index + 1),
        pgn: block, positions,
      });
    } catch (error) {
      errors.push(`Game ${index + 1}: ${error instanceof Error ? error.message : "Could not read PGN"}`);
    }
  });
  return { games, errors };
}

export class BroadcastFetchError extends Error {
  retryAfterMs: number;
  constructor(message: string, retryAfterMs = 60_000) {
    super(message);
    this.retryAfterMs = retryAfterMs;
  }
}

export async function fetchBroadcast(tournament: BroadcastTournament, options: {
  token?: string; signal?: AbortSignal; fetcher?: typeof fetch;
} = {}) {
  const url = new URL(tournament.url);
  url.searchParams.set("clocks", "true");
  url.searchParams.set("comments", "true");
  const headers: Record<string, string> = { Accept: "application/x-chess-pgn" };
  if (options.token?.trim()) headers.Authorization = `Bearer ${options.token.trim()}`;
  const response = await (options.fetcher || fetch)(url, { headers, signal: options.signal, cache: "no-store" });
  if (!response.ok) {
    const retryHeader = response.headers.get("Retry-After");
    const seconds = retryHeader && /^\d+$/.test(retryHeader) ? Number(retryHeader) : 0;
    const retryMs = seconds ? seconds * 1000 : Math.max(60_000, Date.parse(retryHeader || "") - Date.now() || 0);
    throw new BroadcastFetchError(response.status === 429
      ? `Lichess request limit reached. Retrying in ${Math.ceil(retryMs / 1000)} seconds.`
      : `Lichess returned HTTP ${response.status}. Please try again later.`, retryMs);
  }
  const parsed = parseBroadcastPgn(await response.text());
  if (!parsed.games.length && parsed.errors.length) {
    throw new BroadcastFetchError("No readable games were returned by this broadcast.");
  }
  // A tournament feed is fetched as one PGN, so mixed feeds use the fastest game.
  const refreshAfterMs = parsed.games.reduce((interval, game) => {
    const variant = game.headers.Variant?.trim().toLowerCase();
    return Math.min(interval, variant === "blitz" ? 5_000 : variant === "rapid" ? 15_000 : 60_000);
  }, 60_000);
  return { ...parsed, refreshAfterMs };
}

export function lichessGameUrl(value?: string) {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === "lichess.org" && !url.username && !url.password ? url.href : undefined;
  } catch { return undefined; }
}

// Called by the static page build; failures leave the browser's live fallback intact.
export async function fetchBroadcastNames(tournaments: BroadcastTournament[], options: {
  token?: string; fetcher?: typeof fetch;
} = {}) {
  const entries = await Promise.all(tournaments.map(async tournament => {
    try {
      const headers: Record<string, string> = { Accept: "application/json" };
      if (options.token?.trim()) headers.Authorization = `Bearer ${options.token.trim()}`;
      const response = await (options.fetcher || fetch)(`https://lichess.org/api/broadcast/${tournament.id}`, {
        headers, signal: AbortSignal.timeout(10_000), cache: "no-store",
      });
      if (!response.ok) throw new Error("Broadcast metadata unavailable");
      const metadata = await response.json();
      const name = typeof metadata?.tour?.name === "string" ? metadata.tour.name.trim() : "";
      if (name) return [tournament.id, name] as const;
    } catch {
      console.warn(`Could not load build-time broadcast name for ${tournament.id}; using the live fallback.`);
    }
    return undefined;
  }));
  return Object.fromEntries(entries.filter((entry): entry is readonly [string, string] => !!entry));
}
