"use client";
import Link from "next/link";
import { useState } from "react";
import { siteConfig } from "@/lib/site-config";
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
    return (<div className="page-broadcast">
    <section className="page-title">
    <div className="eyebrow">
    <span></span>Digital Board Transmission</div>
    <h1>DGT Live Board Broadcast Hub</h1><p>Watch real-time live electronic DGT board transmissions for Top Boards across Open &amp; Girls age categories.</p></section>
    <section className="broadcast-stage">
    <div className="flexline">
    <div className="flexline">
    <span></span><h2>Board {selectedBoard.board} Live Broadcast Teaser</h2></div>
    <div className="flexline">
    <span>Evaluation: +0.4 (White)</span><button type="button" onClick={handleCopyPgn}>{copiedPgn ? "✓ PGN Copied!" : "Copy PGN"}</button></div>
    </div>
    <div className="subgrid">
    <div className="flexline">
    <div className="chessboard" role="img" aria-label="Chessboard showing the starting position">{Array.from({ length: 64 }, (_, index) => {
            const row = Math.floor(index / 8);
            const column = index % 8;
            const piece = row === 0 ? "♜♞♝♛♚♝♞♜"[column] : row === 1 ? "♟" : row === 6 ? "♙" : row === 7 ? "♖♘♗♕♔♗♘♖"[column] : "";
            return <div key={index} data-square={(row + column) % 2 ? "dark" : "light"} aria-hidden="true">{piece}</div>;
        })}</div>
    <div className="flexline">
    <span>⚪ White: {selectedBoard.white} ({selectedBoard.whiteRating})</span><span>⚫ Black: {selectedBoard.black} ({selectedBoard.blackRating})</span></div>
    </div>
    <div>
    <div>
    <div className="flexline">
    <span>Opening: {selectedBoard.moves}</span><span>Status: {selectedBoard.result}</span></div>
    <div>
    <p className="eyebrow">Live Move Notation Stream</p><div>
    {mockPgn}</div>
    </div>
    </div>
    <div>
    <p className="eyebrow">Select Broadcast Board</p><div className="subgrid">
    <button data-board="1" aria-pressed={selectedBoard.board === 1} onClick={() => setSelectedBoard(liveMatchesMock[0])}><div className="flexline">
    <span>Board 1</span><span>1/2 - 1/2</span></div>
    <p>FM Alexander Kravchenko (AUS)</p><p>vs FM Daniel Han (NZL)</p></button><button data-board="2" aria-pressed={selectedBoard.board === 2} onClick={() => setSelectedBoard(liveMatchesMock[1])}><div className="flexline">
    <span>Board 2</span><span>1 - 0</span></div>
    <p>WFM Sophia Chen (AUS)</p><p>vs WCM Chloe Teo (FIJ)</p></button><button data-board="3" aria-pressed={selectedBoard.board === 3} onClick={() => setSelectedBoard(liveMatchesMock[2])}><div className="flexline">
    <span>Board 3</span><span>0 - 1</span></div>
    <p>Lucas Zhang (AUS)</p><p>vs Rohan Patel (NZL)</p></button><button data-board="4" aria-pressed={selectedBoard.board === 4} onClick={() => setSelectedBoard(liveMatchesMock[3])}><div className="flexline">
    <span>Board 4</span><span>*</span></div>
    <p>Marcus Liu (PNG)</p><p>vs Ethan Wright (AUS)</p></button></div>
    </div>
    </div>
    </div>
    </section>
    <section className="broadcast-directory">
    <div>
    <span className="eyebrow">External Live Servers</span><h2>Complete Transmissions Feed</h2></div>
    <div className="subgrid">{dgtGroups.map(group => <div key={group.title}><h3>{group.title}</h3><div>{group.boards.map(board => <div key={board}>{board}</div>)}</div></div>)}</div>
    <div className="flexline">
    <a href="/dgt-boards" target="_blank" rel="noreferrer" className="action"><span>Launch Live Server: Boards 1 to 11</span><span>↗</span></a><a href="/dgt-boards" target="_blank" rel="noreferrer" className="action"><span>Launch Live Server: Boards 12 to 20</span><span>↗</span></a></div>
    </section>
    </div>);
}
