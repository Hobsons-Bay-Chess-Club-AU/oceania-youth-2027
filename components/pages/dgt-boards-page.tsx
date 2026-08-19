"use client";

import { useState } from "react";
import { siteConfig } from "@/lib/site-config";
import { Hero } from "@/components/ui";
import { dgtGroups } from "@/app/dgt-boards/data";

const liveMatchesMock = [
  { board: 1, white: "FM Alexander Kravchenko (AUS)", whiteRating: 2340, black: "FM Daniel Han (NZL)", blackRating: 2285, result: "1/2 - 1/2", moves: "42 (Ruy Lopez)" },
  { board: 2, white: "WFM Sophia Chen (AUS)", whiteRating: 2110, black: "WCM Chloe Teo (FIJ)", blackRating: 1980, result: "1 - 0", moves: "36 (Sicilian Najdorf)" },
  { board: 3, white: "Lucas Zhang (AUS)", whiteRating: 2050, black: "Rohan Patel (NZL)", blackRating: 2015, result: "0 - 1", moves: "54 (King's Indian)" },
  { board: 4, white: "Marcus Liu (PNG)", whiteRating: 1890, black: "Ethan Wright (AUS)", blackRating: 1955, result: "*", moves: "28 (Queen's Gambit)" },
];

export function DgtBoardsPage() {
  const [selectedBoard, setSelectedBoard] = useState(liveMatchesMock[0]);
  const [copiedPgn, setCopiedPgn] = useState(false);

  const mockPgn = `1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7 6. Re1 b5 7. Bb3 d6 8. c3 O-O 9. h3 Bb7 10. d4 Re8 11. Nbd2 Bf8 12. a4 h6 13. Bc2 exd4 14. cxd4 Nb4 15. Bb1 c5 16. d5 Nd7 17. Ra3 c4 18. Nd4 Ne5`;

  const handleCopyPgn = () => {
    navigator.clipboard.writeText(mockPgn);
    setCopiedPgn(true);
    setTimeout(() => setCopiedPgn(false), 2000);
  };

  return (
    <div className="space-y-8">
      <Hero
        eyebrow="Digital Board Transmission"
        title="DGT Live Board Broadcast Hub"
        description="Watch real-time live electronic DGT board transmissions for Top Boards across Open & Girls age categories."
      />

      {/* Main Broadcast Arena Teaser */}
      <section className="rounded-3xl border border-amber-500/30 bg-slate-900/80 p-6 shadow-2xl backdrop-blur-xl md:p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <span className="flex h-3 w-3 rounded-full bg-emerald-400 animate-ping" />
            <h2 className="font-display text-2xl font-bold text-white">
              Board {selectedBoard.board} Live Broadcast Teaser
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="rounded-full bg-amber-500/10 border border-amber-500/30 px-3 py-1 font-bold text-amber-300">
              Evaluation: +0.4 (White)
            </span>
            <button
              onClick={handleCopyPgn}
              className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 font-bold text-white hover:bg-slate-700 transition"
            >
              {copiedPgn ? "✓ PGN Copied!" : "Copy PGN"}
            </button>
          </div>
        </div>

        {/* Board & Notation Live Display */}
        <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
          {/* Interactive Chess Board Visualization Mock */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center space-y-3">
            <div className="w-full max-w-md aspect-square rounded-2xl border-4 border-slate-800 bg-slate-950 p-2 shadow-2xl grid grid-cols-8 grid-rows-8 gap-0">
              {Array.from({ length: 64 }).map((_, i) => {
                const row = Math.floor(i / 8);
                const col = i % 8;
                const isLight = (row + col) % 2 === 0;
                
                // Sample initial pieces setup representation for visual flair
                let piece = "";
                if (row === 0 && col === 4) piece = "♚";
                if (row === 0 && col === 3) piece = "♛";
                if (row === 0 && (col === 2 || col === 5)) piece = "♝";
                if (row === 0 && (col === 1 || col === 6)) piece = "♞";
                if (row === 0 && (col === 0 || col === 7)) piece = "♜";
                if (row === 1) piece = "♟";
                if (row === 6) piece = "♙";
                if (row === 7 && col === 4) piece = "♔";
                if (row === 7 && col === 3) piece = "♕";
                if (row === 7 && (col === 2 || col === 5)) piece = "♗";
                if (row === 7 && (col === 1 || col === 6)) piece = "♘";
                if (row === 7 && (col === 0 || col === 7)) piece = "♖";

                // Highlight moved squares
                const isHighlight = (row === 6 && col === 4) || (row === 4 && col === 4);

                return (
                  <div
                    key={i}
                    className={`flex items-center justify-center text-xl sm:text-2xl font-bold select-none ${
                      isHighlight
                        ? "bg-amber-400/40 text-amber-200"
                        : isLight
                        ? "bg-amber-100/90 text-slate-900"
                        : "bg-slate-800 text-amber-100"
                    }`}
                  >
                    {piece}
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-between w-full max-w-md text-xs text-slate-400">
              <span>⚪ White: {selectedBoard.white} ({selectedBoard.whiteRating})</span>
              <span>⚫ Black: {selectedBoard.black} ({selectedBoard.blackRating})</span>
            </div>
          </div>

          {/* Move Feed & Player Matchup Card */}
          <div className="lg:col-span-6 space-y-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
                <span>Opening: {selectedBoard.moves}</span>
                <span className="font-bold text-amber-300">Status: {selectedBoard.result}</span>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-bold text-amber-400 uppercase tracking-wider">Live Move Notation Stream</p>
                <div className="rounded-xl border border-slate-800 bg-slate-900 p-3 text-xs font-mono leading-relaxed text-slate-300 max-h-40 overflow-y-auto">
                  {mockPgn}
                </div>
              </div>
            </div>

            {/* Selector Grid for Top Live Boards */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Select Broadcast Board</p>
              <div className="grid grid-cols-2 gap-2">
                {liveMatchesMock.map((match) => (
                  <button
                    key={match.board}
                    onClick={() => setSelectedBoard(match)}
                    className={`rounded-xl border p-3 text-left transition ${
                      selectedBoard.board === match.board
                        ? "border-amber-400 bg-amber-500/10 text-white"
                        : "border-slate-800 bg-slate-950/60 text-slate-400 hover:text-white hover:bg-slate-900"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-amber-300">
                      <span>Board {match.board}</span>
                      <span>{match.result}</span>
                    </div>
                    <p className="mt-1 text-[0.7rem] font-semibold text-slate-200 truncate">{match.white}</p>
                    <p className="text-[0.7rem] text-slate-400 truncate">vs {match.black}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DGT Board Group Links */}
      <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-md md:p-8 space-y-6">
        <div className="border-b border-slate-800 pb-3">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
            External Live Servers
          </span>
          <h2 className="mt-1 font-display text-2xl font-bold text-white md:text-3xl">
            Complete Transmissions Feed
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {dgtGroups.map((group) => (
            <div key={group.title} className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5 space-y-3">
              <h3 className="font-display text-xl font-bold text-amber-300">{group.title}</h3>
              <div className="space-y-2">
                {group.boards.map((b) => (
                  <div key={b} className="rounded-xl border border-slate-800 bg-slate-900 p-3 text-xs text-slate-300 font-medium">
                    {b}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <a
            href={siteConfig.links.liveBoardsGroupA}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 px-5 py-2.5 text-xs font-bold text-slate-950 shadow-md transition hover:scale-105"
          >
            <span>Launch Live Server: Boards 1 to 11</span>
            <span>↗</span>
          </a>
          <a
            href={siteConfig.links.liveBoardsGroupB}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-slate-700"
          >
            <span>Launch Live Server: Boards 12 to 20</span>
            <span>↗</span>
          </a>
        </div>
      </section>
    </div>
  );
}

