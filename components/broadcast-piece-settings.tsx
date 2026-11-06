"use client";

import { createContext, useCallback, useContext, useEffect, useId, useRef, useState, type ImgHTMLAttributes, type ReactNode } from "react";
import { DEFAULT_PIECE_SET, OCEANIA_FEDERATIONS, PIECE_SETS, PIECE_SET_STORAGE_KEY, pieceSource, readPieceSet, savePieceSet, validPieceSet, type PieceSetId } from "@/lib/broadcast-piece-sets";
import styles from "./broadcast-piece-settings.module.css";

type PiecePreferences = { pieceSet: PieceSetId; choose: (id: PieceSetId) => void; storageAvailable: boolean };
const Preferences = createContext<PiecePreferences | null>(null);

export function PieceSetProvider({ children }: { children: ReactNode }) {
  const [pieceSet, setPieceSet] = useState<PieceSetId>(DEFAULT_PIECE_SET);
  const [storageAvailable, setStorageAvailable] = useState(true);
  useEffect(() => {
    try { setPieceSet(readPieceSet(window.localStorage)); }
    catch { setStorageAvailable(false); }
    function sync(event: StorageEvent) {
      if (event.key === PIECE_SET_STORAGE_KEY || event.key === null) setPieceSet(validPieceSet(event.newValue));
    }
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  const choose = useCallback((id: PieceSetId) => {
    setPieceSet(id);
    try { setStorageAvailable(savePieceSet(window.localStorage, id)); }
    catch { setStorageAvailable(false); }
  }, []);
  return <Preferences.Provider value={{ pieceSet, choose, storageAvailable }}>{children}</Preferences.Provider>;
}

function usePreferences() {
  const value = useContext(Preferences);
  if (!value) throw new Error("Piece settings require PieceSetProvider");
  return value;
}

export function PieceImage({ color, type, setId, className = "", ...props }: {
  color: "w" | "b";
  type: string;
  setId?: PieceSetId;
} & ImgHTMLAttributes<HTMLImageElement>) {
  const { pieceSet } = usePreferences();
  return <img {...props} className={`${styles.pieceImage} ${className}`} src={pieceSource(setId || pieceSet, color, type)} />;
}

const PREVIEW_PIECES = [["w", "k"], ["w", "q"], ["w", "r"], ["b", "b"], ["b", "n"], ["b", "p"]] as const;

export function PieceSetSettings() {
  const { pieceSet, choose, storageAvailable } = usePreferences();
  const dialog = useRef<HTMLDialogElement>(null);
  const headingId = useId();
  const groupName = useId();
  return <>
    <button type="button" className={styles.trigger} aria-haspopup="dialog" aria-label="Board settings" onClick={() => dialog.current?.showModal()}>
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M4 7h16M4 17h16"/><circle cx="9" cy="7" r="3" fill="var(--paper)"/><circle cx="15" cy="17" r="3" fill="var(--paper)"/></svg><span>Piece style</span>
    </button>
    <dialog ref={dialog} className={styles.settingsDialog} aria-labelledby={headingId} onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
      <div className={styles.dialogHeader}><div><span className={styles.eyebrow}>Make the board yours</span><h2 id={headingId}>Board settings</h2></div><button type="button" onClick={() => dialog.current?.close()} aria-label="Close board settings">✕</button></div>
      <fieldset><legend>Choose a piece set</legend><div className={styles.setGrid}>
        {[...PIECE_SETS].sort((a, b) => Number(b.id === "oceania-2027") - Number(a.id === "oceania-2027")).map(set => <label key={set.id} className={`${styles.setOption} ${set.id === "oceania-2027" ? styles.officialOption : ""}`}>
          <input type="radio" name={groupName} value={set.id} checked={pieceSet === set.id} onChange={() => choose(set.id)} />
          {set.id === "oceania-2027" && <span className={styles.officialBadge}>Official championship set · Default</span>}
          <span className={styles.optionHeading}><strong>{set.name}</strong><span className={styles.selectedMark} aria-hidden="true">{pieceSet === set.id ? "✓" : ""}</span></span>
          <span className={styles.preview} aria-hidden="true">{PREVIEW_PIECES.map(([color, type]) => <PieceImage key={color + type} color={color} type={type} setId={set.id} alt="" width="42" height="65" draggable={false} />)}</span>
          <span className={styles.description}>{set.description}</span>
          {set.id === "oceania-2027" && <span className={styles.flags}>{OCEANIA_FEDERATIONS.map(([code, name]) => <img key={code} src={`/pacific/flags/${code}.svg`} alt={name} title={name} width="16" height="12" />)}</span>}
        </label>)}
      </div></fieldset>
      <p className={styles.storageNote} role="status">{storageAvailable ? "Applies to every board. Your choice is saved on this device." : "Applies to every board for this visit. Browser storage is unavailable."}</p>
    </dialog>
  </>;
}
