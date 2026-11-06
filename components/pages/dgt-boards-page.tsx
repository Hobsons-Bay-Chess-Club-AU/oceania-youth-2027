"use client";

import { Chess } from "chess.js";
import { useCallback, useEffect, useId, useMemo, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from "react";
import { boardMoveArrow } from "@/lib/broadcast-arrow";
import { replayPlyForKey } from "@/lib/broadcast-replay";
import { fullscreenBoardLayout } from "@/lib/broadcast-layout";
import { PieceImage, PieceSetProvider, PieceSetSettings } from "@/components/broadcast-piece-settings";
import styles from "./dgt-boards.module.css";
import { broadcastConfig } from "@/app/dgt-boards/data";
import {
  BroadcastFetchError, fetchBroadcast, lichessGameUrl,
  type BroadcastGame, type BroadcastPosition, type BroadcastTournament,
} from "@/lib/lichess-broadcast";

const pieceNames: Record<string, string> = {
  k: "king", q: "queen", r: "rook", b: "bishop", n: "knight", p: "pawn",
};

type Feed = Awaited<ReturnType<typeof fetchBroadcast>>;

function BroadcastBoard({ position, label, flipped = false, miniature = false, result }: {
  position: BroadcastPosition;
  label: string;
  flipped?: boolean;
  miniature?: boolean;
  result?: string;
}) {
  const resultText = result === "1-0" ? "1–0" : result === "0-1" ? "0–1" : result === "1/2-1/2" ? "½–½" : undefined;
  const squares = useMemo(() => new Chess(position.fen).board().flat(), [position.fen]);
  const shownSquares = flipped ? [...squares].reverse() : squares;
  const arrow = boardMoveArrow(position.from, position.to, flipped);
  const arrowId = `move-arrow-${useId().replace(/:/g, "")}`;
  return <span className={`chessboard${miniature ? ` ${styles.miniBoard}` : ""}`} role="img" aria-label={`${label}${resultText ? `. Final result: ${resultText}` : ""}`}>
    {shownSquares.map((piece, index) => {
      const file = flipped ? 7 - index % 8 : index % 8;
      const rank = flipped ? Math.floor(index / 8) + 1 : 8 - Math.floor(index / 8);
      const square = `${"abcdefgh"[file]}${rank}`;
      return <span key={square} className={styles.square} data-square={(file + rank) % 2 ? "dark" : "light"} data-highlight={square === position.from || undefined} aria-hidden="true">
        {piece && <PieceImage className={styles.piece} color={piece.color} type={piece.type} width="80" height="80" alt="" title={`${piece.color === "w" ? "White" : "Black"} ${pieceNames[piece.type]}`} draggable={false} />}
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
  </span>;
}

function PlayerIdentity({ headers, color }: { headers: BroadcastGame["headers"]; color: "w" | "b" }) {
  const side = color === "w" ? "White" : "Black";
  const title = (headers[`${side}Title`] || "").trim().toUpperCase();
  const recognizedTitle = /^(W?CM|W?FM|W?IM|W?GM)$/.test(title);
  const rating = (headers[`${side}Elo`] || "").trim();
  return <span className={styles.playerIdentity}>
    {recognizedTitle && <span className={styles.titleBadge} data-title={title}>{title}</span>}
    <strong className={styles.playerName}>{headers[side] || `${side} player`}</strong>
    {/^\d+$/.test(rating) && rating !== "0" && <span className={styles.playerElo}>({rating})</span>}
  </span>;
}

function boardPreviewId(tournamentId: string, gameId: string) {
  return `board-preview-${tournamentId}-${encodeURIComponent(gameId)}`;
}

function BoardOverview({ games, game, round, rounds, tournamentId, tournamentName, onSelect, onRoundChange, onBack, backButton }: {
  games: BroadcastGame[];
  game?: BroadcastGame;
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

  return <section ref={panel} className={`${game ? styles.detailView : styles.overview}${fullscreen ? ` ${styles.fullscreen}` : ""}`} role={fullscreen ? "dialog" : undefined} aria-modal={fullscreen || undefined} aria-label={game ? `${fullscreen ? "Fullscreen " : ""}Board ${game.board} viewer` : fullscreen ? "Fullscreen tournament boards" : "All boards"}>
    {fullscreen ? <div className={styles.fullscreenHeader}>
      {game && allBoardsControl}
      <h2 title={tournamentName}>{tournamentName}</h2>
      <label><span>Round</span><select aria-label="Fullscreen round" value={round} onChange={event => onRoundChange(event.target.value)}>{rounds.map(value => <option key={value} value={value}>{value}</option>)}</select></label>
      <PieceSetSettings />
      <button type="button" ref={exitButton} onClick={exitFullscreen} aria-label="Exit fullscreen"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M4 9h5V4m11 5h-5V4M4 15h5v5m11-5h-5v5"/></svg><span>Exit</span></button>
    </div> : game ? <div className={`${styles.detailToolbar} ${styles.overviewActions}`}>{allBoardsControl}<div className={styles.overviewActions}><PieceSetSettings />{fullscreenControl}</div></div> : <div className={styles.overviewHeading}>
      <div><span className="eyebrow">Round {round}</span><h2>All boards<span>{games.length}</span></h2></div>
      <div className={styles.overviewActions}><p>Choose a board to follow the game.</p><PieceSetSettings />{fullscreenControl}</div>
    </div>}
    <div ref={gridViewport} className={fullscreen ? `${styles.fullscreenViewport}${game ? ` ${styles.fullscreenDetail}` : ""}` : undefined} style={fullscreen && game ? { "--fullscreen-detail-board-size": `${Math.max(160, viewport.height - 240)}px` } as CSSProperties : undefined}>
    {game ? <GameViewer key={`${round}:${game.id}`} game={game} games={games} onSelect={onSelect} /> : <div className={styles.boardGrid} style={fullscreen ? { "--board-columns": layout.columns, "--board-card-width": `${layout.cardWidth}px` } as CSSProperties : undefined}>{games.map(game => {
      const position = game.positions[game.positions.length - 1];
      const white = game.headers.White || "White player";
      const black = game.headers.Black || "Black player";
      const result = game.headers.Result === "*" ? "In progress" : game.headers.Result || "Awaiting result";
      return <button type="button" key={game.id} id={boardPreviewId(tournamentId, game.id)} className={styles.boardCard} aria-label={`View board ${game.board}: ${white} versus ${black}`} onClick={() => onSelect(game.id)}>
        <span className={styles.cardHeading}><span className="eyebrow">Board {game.board.padStart(2, "0")}</span><span className={styles.cardResult} data-live={game.headers.Result === "*"}>{result}</span></span>
        <span className={styles.miniPlayer}><span className={styles.blackMarker} /><PlayerIdentity headers={game.headers} color="b" /><span className={styles.miniClock}>{position.blackClock || "—"}</span></span>
        <BroadcastBoard position={position} label={`Latest position: ${white} versus ${black}`} miniature result={game.headers.Result} />
        <span className={styles.miniPlayer}><span className={styles.whiteMarker} /><PlayerIdentity headers={game.headers} color="w" /><span className={styles.miniClock}>{position.whiteClock || "—"}</span></span>
        <span className={styles.cardFooter}><span>{position.san ? `${position.moveNumber}${position.color === "w" ? "." : "…"} ${position.san}` : "Awaiting first move"}</span><span>View board <span aria-hidden="true">↗</span></span></span>
      </button>;
    })}</div>}</div>
  </section>;
}

function TournamentBroadcast({ tournament, onName, active, divisionPicker }: {
  tournament: BroadcastTournament;
  onName: (id: string, name: string) => void;
  active: boolean;
  divisionPicker: ReactNode;
}) {
  const [feed, setFeed] = useState<Feed>();
  const [error, setError] = useState("");
  const [fetching, setFetching] = useState(true);
  const [updatedAt, setUpdatedAt] = useState<Date>();
  const [round, setRound] = useState("");
  const [gameId, setGameId] = useState("");
  const refresh = useRef<() => void>(() => {});
  const backButton = useRef<HTMLButtonElement>(null);
  const lastViewedId = useRef("");

  useEffect(() => {
    if (!active) return;
    let stopped = false;
    let inFlight = false;
    let timer: ReturnType<typeof setTimeout>;
    let controller: AbortController | undefined;
    let retryAt = 0;
    async function load() {
      if (stopped || inFlight || Date.now() < retryAt) return;
      clearTimeout(timer);
      inFlight = true;
      controller = new AbortController();
      const timeout = setTimeout(() => controller?.abort(), 25_000);
      setFetching(true);
      let delay = 60_000;
      try {
        const data = await fetchBroadcast(tournament, {
          token: process.env.NEXT_PUBLIC_LICHESS_TOKEN,
          signal: controller.signal,
        });
        if (stopped) return;
        setFeed(data);
        const incomingRounds = [...new Set(data.games.map(game => game.roundGroup))]
          .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
        setRound(previous => incomingRounds.includes(previous) ? previous : incomingRounds.at(-1) || "");
        setError("");
        setUpdatedAt(new Date());
        if (data.games[0]) onName(tournament.id, data.games[0].tournamentName);
        delay = data.refreshAfterMs;
        retryAt = 0;
      } catch (cause) {
        if (stopped) return;
        setError(controller.signal.aborted ? "The broadcast request timed out. Please try again."
          : cause instanceof Error ? cause.message : "The broadcast could not be loaded.");
        if (cause instanceof BroadcastFetchError) {
          delay = cause.retryAfterMs;
          retryAt = Date.now() + delay;
        }
      } finally {
        clearTimeout(timeout);
        inFlight = false;
        if (!stopped) {
          setFetching(false);
          timer = setTimeout(() => void load(), delay);
        }
      }
    }
    refresh.current = () => { void load(); };
    void load();
    return () => {
      stopped = true;
      clearTimeout(timer);
      controller?.abort();
      refresh.current = () => {};
    };
  }, [tournament, onName, active]);

  const games = feed?.games || [];
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

  return <>
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
      <p role="status"><span className={styles.statusDot} data-state={error ? "error" : fetching ? "loading" : "ready"} />{fetching ? "Updating broadcast…" : updatedAt ? <>Updated <time dateTime={updatedAt.toISOString()}>{updatedAt.toLocaleTimeString()}</time></> : "Waiting for broadcast"}</p>
      <button type="button" disabled={fetching} onClick={() => refresh.current()}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M20 7v5h-5M4 17v-5h5"/><path d="M6.1 6.1A8 8 0 0 1 20 12M4 12a8 8 0 0 0 13.9 5.9"/></svg>Refresh</button>
    </div>
    {error && <div className="broadcast-notice" role="alert"><p>{error}</p>{feed && <p>Showing the last successfully fetched games.</p>}</div>}
    {!!feed?.errors.length && <details className="broadcast-notice"><summary>{feed.errors.length} game(s) could not be displayed</summary><ul>{feed.errors.map((message, index) => <li key={index}>{message}</li>)}</ul></details>}
    {!fetching && feed && !games.length && <p className="broadcast-notice">No games have been published for this tournament yet.</p>}
    {fetching && !feed && <div className={styles.loadingViewer} aria-label="Loading games" aria-busy="true"><div className={styles.loadingBoard} aria-hidden="true">{Array.from({ length: 64 }, (_, index) => <span key={index} data-dark={(Math.floor(index / 8) + index % 8) % 2 === 1} />)}</div><div className={styles.loadingNotation}><span className="eyebrow">Preparing the boards</span><h2>The next move awaits.</h2><p>Loading games, pairings, and recorded clocks.</p></div></div>}
    {!!roundGames.length && <BoardOverview games={roundGames} game={game} round={selectedRound || ""} rounds={rounds} tournamentId={tournament.id} tournamentName={roundGames[0]?.tournamentName || tournament.id} onSelect={openGame} onRoundChange={chooseRound} onBack={showAllBoards} backButton={backButton} />}
    {feed && <details className={styles.feedNotes}><summary>Broadcast timing</summary><p>This feed refreshes automatically every {feed.refreshAfterMs < 60_000 ? `${feed.refreshAfterMs / 1000} seconds` : "1 minute"}, based on the PGN Variant tag. Updates may still be delayed by Lichess. Clocks show recorded values rather than running timers.</p></details>}
  </>;
}

function GameViewer({ game, games, onSelect }: {
  game: BroadcastGame;
  games: BroadcastGame[];
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

  useEffect(() => {
    function navigateMove(event: KeyboardEvent) {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      if (event.defaultPrevented || event.isComposing || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      // Inactive divisions keep their viewers mounted to preserve replay state.
      if (!viewer.current || viewer.current.closest("[hidden], [inert]") || document.querySelector("dialog[open]")) return;
      if (event.target instanceof Element && event.target.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"]), [role="textbox"], [role="combobox"], [role="slider"], [role="spinbutton"]')) return;
      event.preventDefault();
      const key = event.key;
      setReplayPly(previous => replayPlyForKey(previous, moveCount, key));
    }
    window.addEventListener("keydown", navigateMove);
    return () => window.removeEventListener("keydown", navigateMove);
  }, [moveCount]);

  async function copyPgn() {
    try {
      await navigator.clipboard.writeText(game.pgn);
      setCopyStatus("PGN copied.");
    } catch { setCopyStatus("Could not copy PGN. Please allow clipboard access and try again."); }
  }

  const player = (color: "w" | "b") => <div className={`broadcast-player broadcast-player-${color}`}>
    <PieceImage color={color} type="k" width="32" height="32" alt={color === "w" ? "White" : "Black"} />
    <PlayerIdentity headers={game.headers} color={color} />
    <time aria-label={`${color === "w" ? "White" : "Black"} recorded clock`}>{(color === "w" ? position.whiteClock : position.blackClock) || "—"}</time>
  </div>;

  return <section ref={viewer} className="broadcast-stage" aria-label="Game viewer">
    <div className="flexline">
      <div className={styles.gameHeading}><span className={styles.boardIndex}>{game.board.padStart(2, "0")}</span><div><span className="eyebrow">Round {game.roundGroup}</span><h2>Board {game.board}</h2></div><span className={styles.result} data-live={game.headers.Result === "*"}>{result}</span></div>
      <div className="broadcast-actions"><button type="button" onClick={copyPgn}>Copy PGN</button>{gameUrl && <a href={gameUrl} target="_blank" rel="noreferrer">Lichess ↗</a>}</div>
    </div>
    {copyStatus && <p className="broadcast-copy-status" role="status">{copyStatus}</p>}
    <div className="subgrid">
      <div>
        {player(flipped ? "w" : "b")}
        <BroadcastBoard position={position} flipped={flipped} result={ply === moveCount ? game.headers.Result : undefined} label={`${white} versus ${black}, ${ply ? `after ${position.moveNumber}${position.color === "b" ? "..." : "."} ${position.san}` : "starting position"}. ${flipped ? "Black" : "White"} at bottom.`} />
        {player(flipped ? "b" : "w")}
        <div className="broadcast-controls" aria-label="Replay controls">
          <button type="button" aria-label="Starting position" disabled={ply === 0} onClick={() => setReplayPly(0)}>⏮</button>
          <button type="button" aria-label="Previous move" aria-keyshortcuts="ArrowLeft" title="Previous move (Left arrow)" disabled={ply === 0} onClick={() => setReplayPly(ply - 1)}>←</button>
          <span>{ply} / {moveCount}</span>
          <button type="button" aria-label="Next move" aria-keyshortcuts="ArrowRight" title="Next move (Right arrow)" disabled={ply === moveCount} onClick={() => setReplayPly(ply + 1)}>→</button>
          <button type="button" aria-label="Latest position, follow new moves" aria-pressed={replayPly === null} onClick={() => setReplayPly(null)}>Latest</button>
          <button type="button" aria-label="Flip board" onClick={() => setFlipped(value => !value)}>Flip</button>
        </div>
        <p className="broadcast-cache-note">{replayPly === null ? "Following the latest position." : "Replaying a recorded position."} Clocks show recorded values.</p>
      </div>
      <div className="broadcast-side">
        <div className="broadcast-notation">
          <div className="flexline"><span>{game.headers.Opening || "Opening unavailable"}</span><span>{game.headers.ECO}</span></div>
          <h3 className="eyebrow">Moves <span className={styles.moveHint}>Select a move or use ← →</span></h3>
          <div className="broadcast-moves" aria-label="Select a move to replay">
            {game.positions.slice(1).map((move, index) => <button type="button" key={index} aria-current={ply === index + 1 ? "step" : undefined} onClick={() => setReplayPly(index + 1)}>
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
            <p><span className={styles.whiteMarker} aria-label="White" /><PlayerIdentity headers={candidate.headers} color="w" /></p>
            <p><span className={styles.blackMarker} aria-label="Black" /><PlayerIdentity headers={candidate.headers} color="b" /></p>
            <span className={styles.pairingResult} data-live={candidate.headers.Result === "*"}>{candidate.headers.Result === "*" ? "In progress" : candidate.headers.Result === "1/2-1/2" ? "½–½" : candidate.headers.Result || "—"}</span>
          </button>)}</div>
        </div>
      </div>
    </div>
  </section>;
}

export function DgtBoardsPage({ initialNames = {} }: { initialNames?: Record<string, string> }) {
  const { tournaments, invalidIds } = broadcastConfig;
  const [selectedId, setSelectedId] = useState(tournaments[0]?.id || "");
  const [names, setNames] = useState<Record<string, string>>(initialNames);
  const onName = useCallback((id: string, name: string) => {
    setNames(previous => previous[id] === name ? previous : { ...previous, [id]: name });
  }, []);
  return <PieceSetProvider><div className={`page-broadcast ${styles.room}`}>
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
  </div></PieceSetProvider>;
}
