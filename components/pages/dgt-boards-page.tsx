"use client";


import { Translated } from "@/components/i18n-provider";
import { Chess } from "chess.js";
import { createContext, useContext, useCallback, useEffect, useId, useMemo, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from "react";
import { boardMoveArrow } from "@/lib/broadcast-arrow";
import { BroadcastSoundProvider, BroadcastSoundToggle, useBroadcastSound, useLiveBroadcastSound } from "@/components/broadcast-sound";
import { replayMoveSound } from "@/lib/broadcast-sound";
import { enrichBroadcastPlayers, loadBroadcastPlayers, needsBroadcastPlayers, type BroadcastPlayer } from "@/lib/broadcast-players";
import { replayPlyForKey } from "@/lib/broadcast-replay";
import { fullscreenBoardLayout } from "@/lib/broadcast-layout";
import { PieceImage, PieceSetProvider, PieceSetSettings, usePlayerFederations } from "@/components/broadcast-piece-settings";
import styles from "./dgt-boards.module.css";
import { playerFederationFlag, type FederationLookup } from "@/lib/broadcast-piece-sets";
import { broadcastConfig } from "@/app/dgt-boards/data";
import {
  followBroadcast, mergeBroadcastGames, syncBroadcastClocks, lichessGameUrl, broadcastClock, broadcastPlayerScore,
  type BroadcastConnection, type BroadcastGame, type BroadcastPosition, type BroadcastTournament,
} from "@/lib/lichess-broadcast";

const pieceNames: Record<string, string> = {
  k: "king", q: "queen", r: "rook", b: "bishop", n: "knight", p: "pawn",
};

type Feed = { games: BroadcastGame[]; errors: string[]; snapshotVersion: number };

const ClockNow = createContext(0);

function LiveClockProvider({ games, children }: { games: BroadcastGame[]; children: ReactNode }) {
  const [now, setNow] = useState(() => Date.now());
  const running = games.some(game => game.runningColor);
  useEffect(() => {
    if (!running) return;
    const tick = () => setNow(Date.now());
    tick();
    const timer = window.setInterval(tick, 1000);
    document.addEventListener("visibilitychange", tick);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", tick);
    };
  }, [running]);
  return <ClockNow.Provider value={now}>{children}</ClockNow.Provider>;
}

function BroadcastClock({ game, color, ply = game.positions.length - 1, followLive = true, miniature = false }: {
  game: BroadcastGame; color: "w" | "b"; ply?: number; followLive?: boolean; miniature?: boolean;
}) {
  const now = useContext(ClockNow);
  const clock = broadcastClock(game, ply, color, now, followLive);
  const score = broadcastPlayerScore(game.headers.Result, color);
  if (score) return <span className={`${styles.playerScore}${miniature ? ` ${styles.miniClock}` : ""}`} data-result={score.outcome}
    aria-label={`${color === "w" ? "White" : "Black"} result: ${score.text}, ${score.outcome}`}>{score.text}</span>;
  return <time className={miniature ? styles.miniClock : undefined} data-running={clock.running || undefined}
    data-low-time={clock.lowTime || undefined}
    aria-label={`${color === "w" ? "White" : "Black"} ${clock.running ? "estimated running" : "recorded"} clock`}
    title={clock.running ? "Estimated live clock; synchronizes with the broadcast." : "Recorded broadcast clock"}>{clock.text}</time>;
}


function BroadcastBoard({ position, headers, label, flipped = false, miniature = false, result }: {
  position: BroadcastPosition;
  headers: BroadcastGame["headers"];
  label: string;
  flipped?: boolean;
  miniature?: boolean;
  result?: string;
}) {
  const federations = usePlayerFederations(headers);
  const resultText = result === "1-0" ? "1–0" : result === "0-1" ? "0–1" : result === "1/2-1/2" ? "½–½" : undefined;
  const { squares, checkedColor } = useMemo(() => {
    const board = new Chess(position.fen);
    return { squares: board.board().flat(), checkedColor: board.isCheck() ? board.turn() : undefined };
  }, [position.fen]);
  const shownSquares = flipped ? [...squares].reverse() : squares;
  const arrow = boardMoveArrow(position.from, position.to, flipped);
  const arrowId = `move-arrow-${useId().replace(/:/g, "")}`;
  return <Translated>{<span className={`chessboard${miniature ? ` ${styles.miniBoard}` : ""}`} role="img" aria-label={`${label}${checkedColor ? `. ${checkedColor === "w" ? "White" : "Black"} king in check` : ""}${resultText ? `. Final result: ${resultText}` : ""}`}>
    {shownSquares.map((piece, index) => {
      const file = flipped ? 7 - index % 8 : index % 8;
      const rank = flipped ? Math.floor(index / 8) + 1 : 8 - Math.floor(index / 8);
      const square = `${"abcdefgh"[file]}${rank}`;
      return <span key={square} className={styles.square} data-square={(file + rank) % 2 ? "dark" : "light"} data-highlight={square === position.from || undefined} data-check={(piece?.type === "k" && piece.color === checkedColor) || undefined} aria-hidden="true">
        {piece && <PieceImage className={styles.piece} color={piece.color} type={piece.type} federation={federations[piece.color]} width="80" height="80" alt="" title={`${piece.color === "w" ? "White" : "Black"} ${pieceNames[piece.type]}`} draggable={false} />}
        {index % 8 === 0 && <small className="board-rank">{rank}</small>}
        {index >= 56 && <small className="board-file">{"abcdefgh"[file]}</small>}
      </span>;
    })}
    {arrow && <svg className={styles.moveArrow} viewBox="0 0 8 8" aria-hidden="true" focusable="false">
      <defs><marker id={arrowId} viewBox="0 0 3 3" markerWidth="3" markerHeight="3" refX="3" refY="1.5" orient="auto"><path d="M0 0L3 1.5L0 3Z" fill="currentColor" /></marker></defs>
      <line {...arrow} stroke="currentColor" strokeWidth="0.12" strokeLinecap="round" markerEnd={`url(#${arrowId})`} />
    </svg>}
    {resultText && <svg className={styles.resultWatermark} viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <text x="50" y="50" textAnchor="middle" dominantBaseline="central">{resultText}</text>
    </svg>}
  </span>}</Translated>;
}

function PlayerFlag({ federation, color }: { federation: ReturnType<typeof playerFederationFlag>; color: "w" | "b" }) {
  const [failedSource, setFailedSource] = useState("");
  const side = color === "w" ? "White" : "Black";
  const label = `${side}, ${federation ? `${federation.name} federation` : "federation unavailable"}`;
  return <span className={styles.playerFlag} data-color={color} role="img" aria-label={label} title={label}>
    {federation && failedSource !== federation.src
      ? <img src={federation.src} onError={() => setFailedSource(federation.src)} width="24" height="24" alt="" />
      : <span className={styles.flagFallback} aria-hidden="true">{color === "w" ? "♙" : "♟"}</span>}
  </span>;
}

function PlayerIdentity({ headers, color }: { headers: BroadcastGame["headers"]; color: "w" | "b" }) {
  const federations = usePlayerFederations(headers);
  const federation = playerFederationFlag(headers, color, federations[color]);
  const side = color === "w" ? "White" : "Black";
  const title = (headers[`${side}Title`] || "").trim().toUpperCase();
  const recognizedTitle = /^(W?CM|W?FM|W?IM|W?GM)$/.test(title);
  const rating = (headers[`${side}Elo`] || "").trim();
  return <Translated>{<span className={styles.playerIdentity}>
    <PlayerFlag federation={federation} color={color} />
    {recognizedTitle && <span className={styles.titleBadge} data-title={title}>{title}</span>}
    <strong className={styles.playerName} translate="no">{headers[side] || `${side} player`}</strong>
    {/^\d+$/.test(rating) && rating !== "0" && <span className={styles.playerElo}>({rating})</span>}
  </span>}</Translated>;
}

function boardPreviewId(tournamentId: string, gameId: string) {
  return `board-preview-${tournamentId}-${encodeURIComponent(gameId)}`;
}

function BoardOverview({ games, game, round, rounds, tournamentId, tournamentName, onSelect, onRoundChange, onBack, backButton, active, snapshotVersion }: {
  games: BroadcastGame[];
  game?: BroadcastGame;
  active: boolean;
  snapshotVersion: number;
  round: string;
  rounds: string[];
  tournamentId: string;
  tournamentName: string;
  onSelect: (id: string) => void;
  onRoundChange: (round: string) => void;
  onBack: () => void;
  backButton: RefObject<HTMLButtonElement | null>;
}) {
  const [fullscreen, setFullscreen] = useState(false);
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const panel = useRef<HTMLElement>(null);
  const gridViewport = useRef<HTMLDivElement>(null);
  const fullscreenButton = useRef<HTMLButtonElement>(null);
  const exitButton = useRef<HTMLButtonElement>(null);
  const nativeFullscreen = useRef(false);
  const layout = fullscreenBoardLayout(viewport.width, viewport.height, games.length);
  useLiveBroadcastSound(games, active && !game, snapshotVersion);

  const exitFullscreen = useCallback(() => {
    setFullscreen(false);
    if (document.fullscreenElement === panel.current) void document.exitFullscreen().catch(() => {});
    requestAnimationFrame(() => fullscreenButton.current?.focus({ preventScroll: true }));
  }, []);

  useEffect(() => {
    function syncFullscreen() {
      if (document.fullscreenElement === panel.current) nativeFullscreen.current = true;
      else if (nativeFullscreen.current) {
        nativeFullscreen.current = false;
        setFullscreen(false);
        requestAnimationFrame(() => fullscreenButton.current?.focus({ preventScroll: true }));
      }
    }
    document.addEventListener("fullscreenchange", syncFullscreen);
    return () => {
      document.removeEventListener("fullscreenchange", syncFullscreen);
      if (nativeFullscreen.current && document.fullscreenElement) void document.exitFullscreen().catch(() => {});
    };
  }, []);

  useEffect(() => {
    if (!fullscreen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function measure() {
      const element = gridViewport.current;
      if (!element) return;
      const css = getComputedStyle(element);
      setViewport({
        width: element.clientWidth - parseFloat(css.paddingLeft) - parseFloat(css.paddingRight),
        height: element.clientHeight - parseFloat(css.paddingTop) - parseFloat(css.paddingBottom),
      });
    }
    measure();
    const observer = typeof ResizeObserver === "undefined" ? undefined : new ResizeObserver(measure);
    if (gridViewport.current) observer?.observe(gridViewport.current);
    window.addEventListener("resize", measure);
    function keyboard(event: KeyboardEvent) {
      if (document.querySelector("dialog[open]")) return;
      if (event.key === "Escape") { event.preventDefault(); exitFullscreen(); }
      if (event.key !== "Tab") return;
      const controls = panel.current?.querySelectorAll<HTMLElement>("button:not([disabled]), select:not([disabled]), a[href]");
      if (!controls?.length) return;
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
    document.addEventListener("keydown", keyboard);
    requestAnimationFrame(() => exitButton.current?.focus({ preventScroll: true }));
    return () => {
      document.body.style.overflow = previousOverflow;
      observer?.disconnect();
      window.removeEventListener("resize", measure);
      document.removeEventListener("keydown", keyboard);
    };
  }, [fullscreen, exitFullscreen]);

  function enterFullscreen() {
    setFullscreen(true);
    // The fixed layout also works on browsers without the native Fullscreen API.
    if (panel.current?.requestFullscreen && document.fullscreenEnabled) {
      void panel.current.requestFullscreen().catch(() => {});
    }
  }

  const fullscreenControl = <button type="button" ref={fullscreenButton} onClick={enterFullscreen}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M9 4H4v5m11-5h5v5M4 15v5h5m11-5v5h-5"/></svg>Fullscreen</button>;
  const allBoardsControl = <button type="button" ref={backButton} className={styles.backToBoards} onClick={onBack}><span aria-hidden="true">←</span> All boards <span className={styles.backCount}>{games.length}</span></button>;

  return <LiveClockProvider games={games}><Translated>{<section ref={panel} className={`${game ? styles.detailView : styles.overview}${fullscreen ? ` ${styles.fullscreen}` : ""}`} role={fullscreen ? "dialog" : undefined} aria-modal={fullscreen || undefined} aria-label={game ? `${fullscreen ? "Fullscreen " : ""}Board ${game.board} viewer` : fullscreen ? "Fullscreen tournament boards" : "All boards"}>
    {fullscreen ? <div className={styles.fullscreenHeader}>
      {game && allBoardsControl}
      <h2 title={tournamentName} translate="no">{tournamentName}</h2>
      <label><span>Round</span><select aria-label="Fullscreen round" value={round} onChange={event => onRoundChange(event.target.value)}>{rounds.map(value => <option key={value} value={value}>{value}</option>)}</select></label>
      <BroadcastSoundToggle /><PieceSetSettings />
      <button type="button" ref={exitButton} onClick={exitFullscreen} aria-label="Exit fullscreen"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M4 9h5V4m11 5h-5V4M4 15h5v5m11-5h-5v5"/></svg><span>Exit</span></button>
    </div> : game ? <div className={`${styles.detailToolbar} ${styles.overviewActions}`}>{allBoardsControl}<div className={styles.overviewActions}><BroadcastSoundToggle /><PieceSetSettings />{fullscreenControl}</div></div> : <div className={styles.overviewHeading}>
      <div><span className="eyebrow">Round {round}</span><h2>All boards<span>{games.length}</span></h2></div>
      <div className={styles.overviewActions}><p>Choose a board to follow the game.</p><BroadcastSoundToggle /><PieceSetSettings />{fullscreenControl}</div>
    </div>}
    <div ref={gridViewport} className={fullscreen ? `${styles.fullscreenViewport}${game ? ` ${styles.fullscreenDetail}` : ""}` : undefined} style={fullscreen && game ? { "--fullscreen-detail-board-size": `${Math.max(160, viewport.height - 240)}px` } as CSSProperties : undefined}>
    {game ? <GameViewer key={`${round}:${game.id}`} game={game} games={games} onSelect={onSelect} active={active} snapshotVersion={snapshotVersion} /> : <div className={styles.boardGrid} style={fullscreen ? { "--board-columns": layout.columns, "--board-card-width": `${layout.cardWidth}px` } as CSSProperties : undefined}>{games.map(game => {
      const position = game.positions[game.positions.length - 1];
      const white = game.headers.White || "White player";
      const black = game.headers.Black || "Black player";
      const result = game.headers.Result === "*" ? "In progress" : game.headers.Result || "Awaiting result";
      return <button type="button" key={game.id} id={boardPreviewId(tournamentId, game.id)} className={styles.boardCard} aria-label={`View board ${game.board}: ${white} versus ${black}`} onClick={() => onSelect(game.id)}>
        <span className={styles.cardHeading}><span className="eyebrow">Board {game.board.padStart(2, "0")}</span><span className={styles.cardResult} data-live={game.headers.Result === "*"}>{result}</span></span>
        <span className={styles.miniPlayer}><PlayerIdentity headers={game.headers} color="b" /><BroadcastClock game={game} color="b" miniature /></span>
        <BroadcastBoard headers={game.headers} position={position} label={`Latest position: ${white} versus ${black}`} miniature result={game.headers.Result} />
        <span className={styles.miniPlayer}><PlayerIdentity headers={game.headers} color="w" /><BroadcastClock game={game} color="w" miniature /></span>
        <span className={styles.cardFooter}><span>{position.san ? `${position.moveNumber}${position.color === "w" ? "." : "…"} ${position.san}` : "Awaiting first move"}</span><span>View board <span aria-hidden="true">↗</span></span></span>
      </button>;
    })}</div>}</div>
  </section>}</Translated></LiveClockProvider>;
}

function TournamentBroadcast({ tournament, onName, active, divisionPicker }: {
  tournament: BroadcastTournament;
  onName: (id: string, name: string) => void;
  active: boolean;
  divisionPicker: ReactNode;
}) {
  const [feed, setFeed] = useState<Feed>();
  const [error, setError] = useState("");
  const [connection, setConnection] = useState<BroadcastConnection>("loading");
  const fetching = connection === "loading";
  const [reload, setReload] = useState(0);
  const [updatedAt, setUpdatedAt] = useState<Date>();
  const [round, setRound] = useState("");
  const [gameId, setGameId] = useState("");
  const backButton = useRef<HTMLButtonElement>(null);
  const lastViewedId = useRef("");
  const [players, setPlayers] = useState<BroadcastPlayer[]>([]);
  const needPlayers = needsBroadcastPlayers(feed?.games || []);
  useEffect(() => {
    if (!active || !needPlayers) return;
    let ignored = false;
    void loadBroadcastPlayers(tournament.id).then(roster => {
      if (!ignored) setPlayers(roster);
    });
    return () => { ignored = true; };
  }, [active, needPlayers, tournament.id, reload]);

  useEffect(() => {
    if (!active) return;
    const controller = new AbortController();
    void followBroadcast(tournament, {
      token: process.env.NEXT_PUBLIC_LICHESS_TOKEN,
      signal: controller.signal,
      onState(state, message) {
        if (controller.signal.aborted) return;
        setConnection(state);
        setError(message || "");
      },
      onGames(data, snapshot) {
        if (controller.signal.aborted) return;
        setFeed(previous => ({
          games: snapshot ? syncBroadcastClocks(data.games, previous?.games || [], Date.now())
            : mergeBroadcastGames(previous?.games || [], data.games, Date.now()),
          snapshotVersion: (previous?.snapshotVersion || 0) + (snapshot ? 1 : 0),
          errors: snapshot ? data.errors : [...new Set([...(previous?.errors || []), ...data.errors])].slice(-50),
        }));
        const incomingRounds = [...new Set(data.games.map(game => game.roundGroup))]
          .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
        setRound(previous => snapshot
          ? incomingRounds.includes(previous) ? previous : incomingRounds.at(-1) || ""
          : previous || incomingRounds.at(-1) || "");
        if (data.games.length) {
          setUpdatedAt(new Date());
          onName(tournament.id, data.games[0].tournamentName);
        }
      },
    });
    return () => controller.abort();
  }, [tournament, onName, active, reload]);

  const games = useMemo(() => enrichBroadcastPlayers(feed?.games || [], players), [feed?.games, players]);
  const rounds = [...new Set(games.map(game => game.roundGroup))].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  const selectedRound = rounds.includes(round) ? round : rounds.at(-1);
  const roundGames = games.filter(game => game.roundGroup === selectedRound)
    .sort((a, b) => a.board.localeCompare(b.board, undefined, { numeric: true }));
  const game = roundGames.find(candidate => candidate.id === gameId);

  const chooseRound = (value: string) => { setRound(value); setGameId(""); };
  const openGame = (id: string) => {
    lastViewedId.current = id;
    setGameId(id);
    requestAnimationFrame(() => backButton.current?.focus());
  };
  const showAllBoards = () => {
    setGameId("");
    requestAnimationFrame(() => document.getElementById(boardPreviewId(tournament.id, lastViewedId.current))?.focus());
  };

  return <Translated>{<>
    <section className={styles.selectors} aria-label="Broadcast selection">
      {divisionPicker}
      <div className={styles.roundControl}>
        <div className={styles.controlHeading}><span className="eyebrow">02 / Round</span><span>{roundGames.length ? `${roundGames.length} boards` : "Awaiting games"}</span></div>
        <div className={styles.roundButtons} role="group" aria-label="Choose round">
          {rounds.map(value => <button type="button" key={value} aria-label={`Round ${value}`} aria-pressed={value === selectedRound} onClick={() => chooseRound(value)}>
            <span>Round</span><strong>{value}</strong>
          </button>)}
          {!rounds.length && <span className={styles.roundPlaceholder}>{fetching ? "Loading rounds…" : "No rounds available"}</span>}
        </div>
        <select className={styles.mobileRound} aria-label="Choose round" value={selectedRound || ""} disabled={!rounds.length} onChange={event => chooseRound(event.target.value)}>
          {!rounds.length && <option value="">{fetching ? "Loading rounds…" : "No rounds available"}</option>}
          {rounds.map(value => <option key={value} value={value}>Round {value}</option>)}
        </select>
      </div>
    </section>
    <div className="broadcast-feed-status">
      <p role="status"><span className={styles.statusDot} data-state={error ? "error" : fetching ? "loading" : "ready"} />{fetching ? "Loading broadcast…" : connection === "connecting" ? "Connecting live updates…" : connection === "reconnecting" ? "Reconnecting live updates…" : <>Live{updatedAt && <> · Updated <time dateTime={updatedAt.toISOString()}>{updatedAt.toLocaleTimeString()}</time></>}</>}</p>
      <button type="button" disabled={connection !== "live"} onClick={() => setReload(value => value + 1)}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M20 7v5h-5M4 17v-5h5"/><path d="M6.1 6.1A8 8 0 0 1 20 12M4 12a8 8 0 0 0 13.9 5.9"/></svg>Refresh</button>
    </div>
    {error && <div className="broadcast-notice" role="alert"><p>{error}</p>{feed && <p>Showing the last received games while the connection recovers.</p>}</div>}
    {!!feed?.errors.length && <details className="broadcast-notice"><summary>{feed.errors.length} game(s) could not be displayed</summary><ul>{feed.errors.map((message, index) => <li key={index}>{message}</li>)}</ul></details>}
    {!fetching && feed && !games.length && <p className="broadcast-notice">No games have been published for this tournament yet.</p>}
    {fetching && !feed && <div className={styles.loadingViewer} aria-label="Loading games" aria-busy="true"><div className={styles.loadingBoard} aria-hidden="true">{Array.from({ length: 64 }, (_, index) => <span key={index} data-dark={(Math.floor(index / 8) + index % 8) % 2 === 1} />)}</div><div className={styles.loadingNotation}><span className="eyebrow">Preparing the boards</span><h2>The next move awaits.</h2><p>Loading games, pairings, and recorded clocks.</p></div></div>}
    {!!roundGames.length && <BoardOverview active={active} snapshotVersion={feed?.snapshotVersion || 0} games={roundGames} game={game} round={selectedRound || ""} rounds={rounds} tournamentId={tournament.id} tournamentName={roundGames[0]?.tournamentName || tournament.id} onSelect={openGame} onRoundChange={chooseRound} onBack={showAllBoards} backButton={backButton} />}
  </>}</Translated>;
}

function GameViewer({ game, games, onSelect, active, snapshotVersion }: {
  game: BroadcastGame;
  games: BroadcastGame[];
  active: boolean;
  snapshotVersion: number;
  onSelect: (id: string) => void;
}) {
  // null follows incoming moves; a number pins the viewer to a historical move.
  const [replayPly, setReplayPly] = useState<number | null>(null);
  const [flipped, setFlipped] = useState(false);
  const [copyStatus, setCopyStatus] = useState("");
  const viewer = useRef<HTMLElement>(null);
  const ply = Math.min(replayPly ?? game.positions.length - 1, game.positions.length - 1);
  const position = game.positions[ply];
  const gameUrl = lichessGameUrl(game.headers.GameURL) || lichessGameUrl(game.headers.BroadcastURL);
  const white = game.headers.White || "White player";
  const black = game.headers.Black || "Black player";
  const result = game.headers.Result === "*" ? "In progress" : game.headers.Result || "Awaiting result";
  const moveCount = game.positions.length - 1;
  const { play } = useBroadcastSound();
  useLiveBroadcastSound([game], active && replayPly === null, snapshotVersion);
  const navigateReplay = useCallback((next: number | null) => {
    const target = Math.max(0, Math.min(next ?? game.positions.length - 1, game.positions.length - 1));
    play(replayMoveSound(game, ply, target));
    setReplayPly(next);
  }, [game, ply, play]);

  useEffect(() => {
    function navigateMove(event: KeyboardEvent) {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      if (event.defaultPrevented || event.isComposing || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      // Inactive divisions keep their viewers mounted to preserve replay state.
      if (!viewer.current || viewer.current.closest("[hidden], [inert]") || document.querySelector("dialog[open]")) return;
      if (event.target instanceof Element && event.target.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"]), [role="textbox"], [role="combobox"], [role="slider"], [role="spinbutton"]')) return;
      event.preventDefault();
      const key = event.key;
      navigateReplay(replayPlyForKey(replayPly, moveCount, key));
    }
    window.addEventListener("keydown", navigateMove);
    return () => window.removeEventListener("keydown", navigateMove);
  }, [moveCount, replayPly, navigateReplay]);

  async function copyPgn() {
    try {
      await navigator.clipboard.writeText(game.pgn);
      setCopyStatus("PGN copied.");
    } catch { setCopyStatus("Could not copy PGN. Please allow clipboard access and try again."); }
  }

  const federations = usePlayerFederations(game.headers);
  const player = (color: "w" | "b") => <div className={`broadcast-player broadcast-player-${color}`}>
    <PieceImage color={color} type="k" federation={federations[color]} width="32" height="32" alt={color === "w" ? "White" : "Black"} />
    <PlayerIdentity headers={game.headers} color={color} />
    <BroadcastClock game={game} color={color} ply={ply} followLive={replayPly === null} />
  </div>;

  return <Translated>{<section ref={viewer} className="broadcast-stage" aria-label="Game viewer">
    <div className="flexline">
      <div className={styles.gameHeading}><span className={styles.boardIndex}>{game.board.padStart(2, "0")}</span><div><span className="eyebrow">Round {game.roundGroup}</span><h2>Board {game.board}</h2></div><span className={styles.result} data-live={game.headers.Result === "*"}>{result}</span></div>
      <div className="broadcast-actions"><button type="button" onClick={copyPgn}>Copy PGN</button>{gameUrl && <a href={gameUrl} target="_blank" rel="noreferrer">Lichess ↗</a>}</div>
    </div>
    {copyStatus && <p className="broadcast-copy-status" role="status">{copyStatus}</p>}
    <div className="subgrid">
      <div>
        {player(flipped ? "w" : "b")}
        <BroadcastBoard headers={game.headers} position={position} flipped={flipped} result={ply === moveCount ? game.headers.Result : undefined} label={`${white} versus ${black}, ${ply ? `after ${position.moveNumber}${position.color === "b" ? "..." : "."} ${position.san}` : "starting position"}. ${flipped ? "Black" : "White"} at bottom.`} />
        {player(flipped ? "b" : "w")}
        <div className="broadcast-controls" aria-label="Replay controls">
          <button type="button" aria-label="Starting position" disabled={ply === 0} onClick={() => navigateReplay(0)}>⏮</button>
          <button type="button" aria-label="Previous move" aria-keyshortcuts="ArrowLeft" title="Previous move (Left arrow)" disabled={ply === 0} onClick={() => navigateReplay(ply - 1)}>←</button>
          <span>{ply} / {moveCount}</span>
          <button type="button" aria-label="Next move" aria-keyshortcuts="ArrowRight" title="Next move (Right arrow)" disabled={ply === moveCount} onClick={() => navigateReplay(ply + 1)}>→</button>
          <button type="button" aria-label="Latest position, follow new moves" aria-pressed={replayPly === null} onClick={() => navigateReplay(null)}>Latest</button>
          <button type="button" aria-label="Flip board" onClick={() => setFlipped(value => !value)}>Flip</button>
        </div>
        <p className="broadcast-cache-note">{replayPly === null ? "Following the latest position." : "Replaying a recorded position."} {replayPly === null ? "Live clocks are estimates between broadcast updates; finished games show player scores." : broadcastPlayerScore(game.headers.Result, "w") ? "Finished games show player scores." : "Clocks show recorded values."}</p>
      </div>
      <div className="broadcast-side">
        <div className="broadcast-notation">
          <div className="flexline"><span>{game.headers.Opening || "Opening unavailable"}</span><span>{game.headers.ECO}</span></div>
          <h3 className="eyebrow">Moves <span className={styles.moveHint}>Select a move or use ← →</span></h3>
          <div className="broadcast-moves" aria-label="Select a move to replay">
            {game.positions.slice(1).map((move, index) => <button type="button" key={index} aria-current={ply === index + 1 ? "step" : undefined} onClick={() => navigateReplay(index + 1)}>
              <span>{move.moveNumber}{move.color === "w" ? "." : "…"}</span> {move.san}
            </button>)}
            {!moveCount && <p>Waiting for the first move.</p>}
          </div>
          {position.comment && <p className="broadcast-comment">{position.comment}</p>}
        </div>
        <div className="broadcast-pairings">
          <h3 className="eyebrow">Boards in this round <span className={styles.boardCount}>{games.length}</span></h3>
          <div className="subgrid">{games.map(candidate => <button type="button" key={candidate.id} data-board={candidate.board} aria-pressed={candidate.id === game.id} onClick={() => onSelect(candidate.id)}>
            <span className={styles.pairingBoardLabel}>Board {candidate.board}</span>
            <p><PlayerIdentity headers={candidate.headers} color="w" /></p>
            <p><PlayerIdentity headers={candidate.headers} color="b" /></p>
            <span className={styles.pairingResult} data-live={candidate.headers.Result === "*"}>{candidate.headers.Result === "*" ? "In progress" : candidate.headers.Result === "1/2-1/2" ? "½–½" : candidate.headers.Result || "—"}</span>
          </button>)}</div>
        </div>
      </div>
    </div>
  </section>}</Translated>;
}

export function DgtBoardsPage({ initialNames = {}, federationLookup = {} }: { initialNames?: Record<string, string>; federationLookup?: FederationLookup }) {
  const { tournaments, invalidIds } = broadcastConfig;
  const [selectedId, setSelectedId] = useState(tournaments[0]?.id || "");
  const [names, setNames] = useState<Record<string, string>>(initialNames);
  const onName = useCallback((id: string, name: string) => {
    setNames(previous => previous[id] === name ? previous : { ...previous, [id]: name });
  }, []);
  return <Translated>{<BroadcastSoundProvider><PieceSetProvider federationLookup={federationLookup}><div className={`page-broadcast ${styles.room}`}>
    <section className={`page-title ${styles.title}`}><div className="eyebrow">Oceania Youth 2027 / DGT broadcasts</div>
      <h1>Broadcast room</h1><p>Choose your division. Find your round.<br />Follow the action, one move at a time.</p>
    </section>
    {!!invalidIds.length && <p className="broadcast-notice" role="alert">Some tournament IDs are invalid and could not be loaded: {invalidIds.join(", ")}</p>}
    {!tournaments.length ? <p className="broadcast-notice">Tournament broadcasts will appear here when they are available.</p> : tournaments.map(entry => <div key={entry.id} hidden={entry.id !== selectedId} className={styles.divisionPanel}>
      <TournamentBroadcast tournament={entry} onName={onName} active={entry.id === selectedId} divisionPicker={<div className={styles.divisionControl}>
        <div className={styles.controlHeading}><label className="eyebrow" htmlFor={`division-${entry.id}`}>01 / Division</label><span>{tournaments.length} available</span></div>
        <select id={`division-${entry.id}`} value={selectedId} onChange={event => {
          const nextId = event.target.value;
          setSelectedId(nextId);
          requestAnimationFrame(() => document.getElementById(`division-${nextId}`)?.focus({ preventScroll: true }));
        }}>
          {tournaments.map((option, index) => <option key={option.id} value={option.id}>{names[option.id] || `Division ${index + 1}`}</option>)}
        </select>
      </div>} />
    </div>)}
  </div></PieceSetProvider></BroadcastSoundProvider>}</Translated>;
}
