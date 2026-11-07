"use client";

import { createContext, useCallback, useContext, useEffect, useId, useMemo, useRef, useState, type ImgHTMLAttributes, type ReactNode } from "react";
import { DEFAULT_PIECE_SET, OCEANIA_FEDERATIONS, CLASSIC_PIECE_SETS, FEDERATION_PIECE_SETS, PIECE_SETS, PIECE_SET_STORAGE_KEY, pieceSource, readPieceSet, savePieceSet, validPiecePreference, playerFederation, resolvePieceSet, type PieceSetId, type PiecePreference, type FederationLookup } from "@/lib/broadcast-piece-sets";
import styles from "./broadcast-piece-settings.module.css";

type PiecePreferences = { pieceSet: PiecePreference; choose: (id: PiecePreference) => void; storageAvailable: boolean; federationLookup: FederationLookup };
const Preferences = createContext<PiecePreferences | null>(null);

export function PieceSetProvider({ children, federationLookup = {} }: { children: ReactNode; federationLookup?: FederationLookup }) {
  const [pieceSet, setPieceSet] = useState<PiecePreference>(DEFAULT_PIECE_SET);
  const [storageAvailable, setStorageAvailable] = useState(true);
  useEffect(() => {
    try { setPieceSet(readPieceSet(window.localStorage)); }
    catch { setStorageAvailable(false); }
    function sync(event: StorageEvent) {
      if (event.key === PIECE_SET_STORAGE_KEY || event.key === null) setPieceSet(validPiecePreference(event.newValue));
    }
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  const choose = useCallback((id: PiecePreference) => {
    setPieceSet(id);
    try { setStorageAvailable(savePieceSet(window.localStorage, id)); }
    catch { setStorageAvailable(false); }
  }, []);
  return <Preferences.Provider value={{ pieceSet, choose, storageAvailable, federationLookup }}>{children}</Preferences.Provider>;
}

function usePreferences() {
  const value = useContext(Preferences);
  if (!value) throw new Error("Piece settings require PieceSetProvider");
  return value;
}

export function usePlayerFederations(headers: Record<string, string>) {
  const { federationLookup } = usePreferences();
  return useMemo(() => ({ w: playerFederation(headers, "w", federationLookup), b: playerFederation(headers, "b", federationLookup) }), [headers, federationLookup]);
}

export function PieceImage({ color, type, setId, federation, className = "", ...props }: {
  color: "w" | "b";
  type: string;
  setId?: PieceSetId;
  federation?: string;
} & ImgHTMLAttributes<HTMLImageElement>) {
  const { pieceSet } = usePreferences();
  return <img {...props} className={`${styles.pieceImage} ${className}`} src={pieceSource(setId || resolvePieceSet(pieceSet, federation), color, type)} />;
}

const PREVIEW_PIECES = [["w", "k"], ["w", "q"], ["w", "r"], ["b", "b"], ["b", "n"], ["b", "p"]] as const;

export function PieceSetSettings() {
  const { pieceSet, choose, storageAvailable } = usePreferences();
  const dialog = useRef<HTMLDialogElement>(null);
  const headingId = useId();
  const groupName = useId();
  const searchId = useId();
  const [query, setQuery] = useState("");
  const visibleFederations = FEDERATION_PIECE_SETS.filter(set => `${set.name} ${set.code} ${set.fide}`.toLowerCase().includes(query.trim().toLowerCase()));
  function option(set: typeof PIECE_SETS[number]) {
    const official = set.id === "oceania-2027";
    const country = "code" in set ? set : undefined;
    return <label key={set.id} className={`${styles.setOption} ${official ? styles.officialOption : ""}`}>
      <input type="radio" name={groupName} value={set.id} checked={pieceSet === set.id} onChange={() => choose(set.id)} />
      {official && <span className={styles.officialBadge}>Official championship set · Default</span>}
      <span className={styles.optionHeading}><strong>{country && <img src={`/pacific/flags/${country.code}.svg`} alt="" width="22" height="16" />} {set.name}</strong><span className={styles.selectedMark} aria-hidden="true">{pieceSet === set.id ? "✓" : ""}</span></span>
      <span className={styles.preview} aria-hidden="true">{PREVIEW_PIECES.map(([color, type]) => <PieceImage key={color + type} color={color} type={type} setId={set.id} alt="" width="42" height="65" draggable={false} loading="lazy" />)}</span>
      <span className={styles.description}>{set.description}</span>
      {official && <span className={styles.flags}>{OCEANIA_FEDERATIONS.map(([code, name]) => <img key={code} src={`/pacific/flags/${code}.svg`} alt={name} title={name} width="16" height="12" />)}</span>}
    </label>;
  }
  return <>
    <button type="button" className={styles.trigger} aria-haspopup="dialog" aria-label="Board settings" onClick={() => dialog.current?.showModal()}>
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M4 7h16M4 17h16"/><circle cx="9" cy="7" r="3" fill="var(--paper)"/><circle cx="15" cy="17" r="3" fill="var(--paper)"/></svg><span>Piece style</span>
    </button>
    <dialog ref={dialog} className={styles.settingsDialog} aria-labelledby={headingId} onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
      <div className={styles.dialogHeader}><div><span className={styles.eyebrow}>Make the board yours</span><h2 id={headingId}>Board settings</h2></div><button type="button" onClick={() => dialog.current?.close()} aria-label="Close board settings">✕</button></div>
      <fieldset><legend>Choose a piece set</legend><div className={styles.setGrid}>
        {option(CLASSIC_PIECE_SETS.find(set => set.id === "oceania-2027")!)}
        <label className={`${styles.setOption} ${styles.adaptiveOption}`}>
          <input type="radio" name={groupName} value="adaptive" checked={pieceSet === "adaptive"} onChange={() => choose("adaptive")} />
          <span className={styles.optionHeading}><strong>Adaptive · Follow each player</strong><span className={styles.selectedMark} aria-hidden="true">{pieceSet === "adaptive" ? "✓" : ""}</span></span>
          <span className={styles.adaptivePreview} aria-hidden="true"><PieceImage color="w" type="k" setId="federation-au" alt="" width="50" height="60" /><span>White’s federation <span>vs</span> Black’s federation</span><PieceImage color="b" type="k" setId="federation-nz" alt="" width="50" height="60" /></span>
          <span className={styles.description}>Each side wears its player’s federation set. When a federation is unavailable, that side uses the official Oceania set.</span>
        </label>
      </div></fieldset>
      <fieldset className={styles.collection}><legend>Federation collection · 13 sets</legend>
        <label className={styles.searchLabel} htmlFor={searchId}>Find a federation</label>
        <input id={searchId} className={styles.searchInput} type="search" placeholder="Search country or federation code" value={query} onChange={event => setQuery(event.target.value)} />
        <div className={styles.setGrid}>{visibleFederations.map(federation => option(PIECE_SETS.find(set => set.id === `federation-${federation.code}`)!))}</div>
        {!visibleFederations.length && <p className={styles.storageNote} role="status">No federations match “{query}”.</p>}
      </fieldset>
      <fieldset className={styles.collection}><legend>Classic styles</legend><div className={styles.setGrid}>{CLASSIC_PIECE_SETS.filter(set => set.id !== "oceania-2027").map(option)}</div></fieldset>
      <p className={styles.storageNote} role="status">{storageAvailable ? "Applies to every board. Your choice is saved on this device." : "Applies to every board for this visit. Browser storage is unavailable."}</p>
    </dialog>
  </>;
}
