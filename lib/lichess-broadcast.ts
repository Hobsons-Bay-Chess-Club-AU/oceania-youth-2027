import { Chess } from "chess.js";

export type BroadcastTournament = { id: string; url: string };
export type BroadcastPosition = {
  fen: string; san?: string; color?: "w" | "b"; moveNumber?: number;
  from?: string; to?: string; whiteClock?: string; blackClock?: string; comment?: string;
};
export type BroadcastGame = {
  id: string; headers: Record<string, string>; tournamentName: string;
  round: string; roundGroup: string; board: string; pgn: string; positions: BroadcastPosition[];
  clockStartedAt?: number; runningColor?: "w" | "b";
};

// PGN clocks have no move timestamp. Anchor estimates on first observation of
// a position, keeping that anchor when an unchanged feed is fetched again.
export function syncBroadcastClocks(games: BroadcastGame[], previous: BroadcastGame[], now: number) {
  const oldGames = new Map(previous.map(game => [game.id, game]));
  return games.map(game => {
    const position = game.positions.at(-1)!;
    const old = oldGames.get(game.id);
    const oldPosition = old?.positions.at(-1);
    const unchanged = old?.positions.length === game.positions.length && oldPosition?.fen === position.fen
      && oldPosition?.whiteClock === position.whiteClock && oldPosition?.blackClock === position.blackClock
      && old?.headers.Result === game.headers.Result;
    const board = new Chess(position.fen);
    const runningColor = game.headers.Result === "*" && game.positions.length > 1
      && !board.isCheckmate() && !board.isStalemate() && !board.isInsufficientMaterial() ? board.turn() : undefined;
    return { ...game, clockStartedAt: unchanged ? old?.clockStartedAt ?? now : now, runningColor };
  });
}

export function broadcastPlayerScore(result: string | undefined, color: "w" | "b") {
  if (result === "1/2-1/2") return { text: "½", outcome: "draw" } as const;
  if (result !== "1-0" && result !== "0-1") return undefined;
  const won = result === (color === "w" ? "1-0" : "0-1");
  return { text: won ? "1" : "0", outcome: won ? "win" : "loss" } as const;
}

export function broadcastClock(game: BroadcastGame, ply: number, color: "w" | "b", now: number, followLive = true) {
  const position = game.positions[ply];
  const recorded = color === "w" ? position?.whiteClock : position?.blackClock;
  const match = recorded?.match(/^(\d+):([0-5]\d):([0-5]\d(?:\.\d+)?)$/);
  const running = !!match && followLive && ply === game.positions.length - 1
    && game.runningColor === color && game.clockStartedAt !== undefined;
  if (!match) return { text: recorded || "—", running: false, lowTime: false };
  const seconds = Math.ceil(Math.max(0, Number(match[1]) * 3600 + Number(match[2]) * 60 + Number(match[3])
    - (running ? Math.max(0, now - game.clockStartedAt!) / 1000 : 0)));
  const hours = Math.floor(seconds / 3600);
  const minutes = String(Math.floor(seconds / 60) % 60);
  const text = `${hours ? `${hours}:${minutes.padStart(2, "0")}` : minutes}:${String(seconds % 60).padStart(2, "0")}`;
  return { text, running, lowTime: seconds < 20 };
}

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

function broadcastResponseError(response: Response) {
  const retryHeader = response.headers.get("Retry-After");
  const seconds = retryHeader && /^\d+$/.test(retryHeader) ? Number(retryHeader) : 0;
  const retryMs = seconds ? seconds * 1000 : Math.max(60_000, Date.parse(retryHeader || "") - Date.now() || 0);
  return new BroadcastFetchError(response.status === 429
    ? `Lichess request limit reached. Retrying in ${Math.ceil(retryMs / 1000)} seconds.`
    : response.status === 401 || response.status === 403
      ? "Lichess denied access. Check the configured token and its study:read permission."
      : `Lichess returned HTTP ${response.status}. Please try again later.`, retryMs);
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
  if (!response.ok) throw broadcastResponseError(response);
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

type BroadcastUpdate = ReturnType<typeof parseBroadcastPgn>;

export function mergeBroadcastGames(previous: BroadcastGame[], updates: BroadcastGame[], now: number) {
  const merged = new Map(previous.map(game => [game.id, game]));
  for (const game of syncBroadcastClocks(updates, previous, now)) {
    // A single-game message has index zero; preserve its original board number
    // when the PGN has neither Board nor a compound Round tag.
    const old = merged.get(game.id);
    if (!game.headers.Board && !/^\d+\.\d+$/.test(game.round)) {
      game.board = old?.board || String(1 + Math.max(0, ...[...merged.values()]
        .filter(candidate => candidate.roundGroup === game.roundGroup)
        .map(candidate => Number(candidate.board) || 0)));
    }
    merged.set(game.id, game);
  }
  return [...merged.values()];
}

// HTTP chunks are arbitrary byte fragments, not game boundaries. Emit once a
// complete movetext result token arrives, outside comments and variations.
function pgnStreamParser(onGames: (update: BroadcastUpdate) => void) {
  let pending = "";
  let lines: string[] = [];
  let size = 0;
  let inComment = false;
  let variationDepth = 0;
  function line(value: string) {
    value = value.replace(/\r$/, "");
    if (!lines.length && !value.trim()) return; // stream heartbeat
    lines.push(value);
    size += value.length;
    if (size > 2_000_000) throw new Error("A broadcast game exceeded the streaming size limit.");
    if (!inComment && /^\s*\[\w+\s+"/.test(value)) return;
    let mainline = "";
    for (const char of value) {
      if (inComment) { if (char === "}") inComment = false; continue; }
      if (char === ";") break;
      if (char === "{") { inComment = true; mainline += " "; continue; }
      if (char === "(") { variationDepth++; continue; }
      if (char === ")") { variationDepth = Math.max(0, variationDepth - 1); continue; }
      if (!variationDepth) mainline += char;
    }
    if (!inComment && variationDepth === 0 && /(?:^|\s)(?:1-0|0-1|1\/2-1\/2|\*)\s*$/.test(mainline)) {
      const pgn = lines.join("\n");
      lines = [];
      size = 0;
      onGames(parseBroadcastPgn(pgn));
    }
  }
  return {
    push(text: string) {
      const complete = (pending + text).split("\n");
      pending = complete.pop()!;
      for (const value of complete) line(value);
      if (pending.length > 2_000_000) throw new Error("A broadcast game exceeded the streaming size limit.");
    },
    finish() {
      if (pending.trim()) line(pending);
      if (lines.some(value => value.trim())) throw new Error("The broadcast stream ended with an incomplete game.");
    },
  };
}

export async function streamBroadcast(tournament: BroadcastTournament, options: {
  token?: string; signal?: AbortSignal; fetcher?: typeof fetch;
  onGames: (update: BroadcastUpdate) => void; onConnected?: () => void;
}) {
  if (options.signal?.aborted) return;
  const controller = new AbortController();
  let reader: ReadableStreamDefaultReader<Uint8Array> | undefined;
  const abort = () => {
    controller.abort();
    void reader?.cancel().catch(() => {});
  };
  options.signal?.addEventListener("abort", abort, { once: true });
  let timeout = setTimeout(abort, 25_000);
  try {
    const url = new URL(`https://lichess.org/api/stream/broadcast/tour/${tournament.id}.pgn`);
    url.searchParams.set("clocks", "true");
    url.searchParams.set("comments", "true");
    const headers: Record<string, string> = { Accept: "application/x-chess-pgn" };
    if (options.token?.trim()) headers.Authorization = `Bearer ${options.token.trim()}`;
    const response = await (options.fetcher || fetch)(url, { headers, signal: controller.signal, cache: "no-store" });
    if (!response.ok) throw broadcastResponseError(response);
    if (!response.body) throw new Error("This browser could not open the live broadcast stream.");
    reader = response.body.getReader();
    options.onConnected?.();
    const decoder = new TextDecoder();
    const parser = pgnStreamParser(options.onGames);
    while (!controller.signal.aborted) {
      clearTimeout(timeout);
      // Lichess sends keepalive newlines even when no moves are being played.
      timeout = setTimeout(abort, 90_000);
      const { value, done } = await reader.read();
      if (controller.signal.aborted) break;
      if (done) {
        parser.push(decoder.decode());
        parser.finish();
        return;
      }
      parser.push(decoder.decode(value, { stream: true }));
    }
    if (!options.signal?.aborted) throw new Error("The live broadcast connection timed out.");
  } catch (error) {
    if (!options.signal?.aborted) throw error;
  } finally {
    clearTimeout(timeout);
    options.signal?.removeEventListener("abort", abort);
    await reader?.cancel().catch(() => {});
    reader?.releaseLock();
  }
}

export type BroadcastConnection = "loading" | "connecting" | "live" | "reconnecting";

function waitForBroadcastRetry(ms: number, signal: AbortSignal) {
  return new Promise<void>(resolve => {
    if (signal.aborted) { resolve(); return; }
    const done = () => { clearTimeout(timer); signal.removeEventListener("abort", done); resolve(); };
    const timer = setTimeout(done, ms);
    signal.addEventListener("abort", done, { once: true });
  });
}

export async function followBroadcast(tournament: BroadcastTournament, options: {
  token?: string; signal: AbortSignal; fetcher?: typeof fetch;
  onGames: (update: BroadcastUpdate, snapshot: boolean) => void;
  onState: (state: BroadcastConnection, message?: string) => void;
  wait?: (ms: number, signal: AbortSignal) => Promise<void>;
}) {
  let loaded = false;
  let attempts = 0;
  while (!options.signal.aborted) {
    let startedAt = 0;
    try {
      if (!loaded) {
        options.onState("loading");
        const snapshot = await fetchBroadcast(tournament, { ...options,
          signal: AbortSignal.any([options.signal, AbortSignal.timeout(25_000)]),
        });
        if (options.signal.aborted) return;
        options.onGames(snapshot, true);
        loaded = true;
      }
      options.onState("connecting");
      startedAt = Date.now();
      await streamBroadcast(tournament, { ...options,
        onConnected: () => { if (!options.signal.aborted) options.onState("live"); },
        onGames: data => { if (!options.signal.aborted) options.onGames(data, false); },
      });
      if (Date.now() - startedAt >= 60_000) attempts = 0;
      if (options.signal.aborted) return;
      throw new Error("The live broadcast connection closed.");
    } catch (cause) {
      if (options.signal.aborted) return;
      if (startedAt && Date.now() - startedAt >= 60_000) attempts = 0;
      const delay = Math.max(Math.min(60_000, 5_000 * 2 ** Math.min(attempts++, 4)),
        cause instanceof BroadcastFetchError ? cause.retryAfterMs : 0);
      const message = cause instanceof Error ? cause.message : "The live broadcast connection was interrupted.";
      options.onState("reconnecting", `${message} Reconnecting in ${Math.ceil(delay / 1000)} seconds.`);
      await (options.wait || waitForBroadcastRetry)(delay, options.signal);
    }
  }
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
