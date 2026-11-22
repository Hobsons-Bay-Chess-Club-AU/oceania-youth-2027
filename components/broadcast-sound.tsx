"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { Translated } from '@/components/i18n-provider';
import { BroadcastSoundPlayer, SOUND_STORAGE_KEY, liveMoveSound, readSoundPreference, type MoveSound } from '@/lib/broadcast-sound';
import type { BroadcastGame } from '@/lib/lichess-broadcast';

const SoundContext = createContext<{ enabled: boolean; toggle: () => void; play: (sound?: MoveSound) => void } | null>(null);

export function BroadcastSoundProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(true);
  const enabledRef = useRef(true);
  const player = useRef<BroadcastSoundPlayer | null>(null);
  const engine = useCallback(() => {
    if (!player.current) player.current = new BroadcastSoundPlayer(() => {
      const Constructor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Constructor) throw new Error('Audio is unavailable');
      return new Constructor();
    });
    return player.current;
  }, []);

  useEffect(() => {
    function preference(value: string | null) {
      const next = readSoundPreference(value);
      enabledRef.current = next;
      setEnabled(next);
      if (!next) player.current?.stop();
    }
    try { preference(window.localStorage.getItem(SOUND_STORAGE_KEY)); } catch { /* current visit still works */ }
    const sync = (event: StorageEvent) => {
      if (event.key === SOUND_STORAGE_KEY || event.key === null) preference(event.newValue);
    };
    const activate = () => { if (enabledRef.current) void engine().unlock(); };
    const visibility = () => { if (document.hidden) player.current?.stop(); };
    window.addEventListener('storage', sync);
    window.addEventListener('click', activate, true);
    window.addEventListener('keydown', activate, true);
    document.addEventListener('visibilitychange', visibility);
    return () => {
      window.removeEventListener('storage', sync);
      window.removeEventListener('click', activate, true);
      window.removeEventListener('keydown', activate, true);
      document.removeEventListener('visibilitychange', visibility);
      player.current?.close();
    };
  }, [engine]);

  const toggle = useCallback(() => {
    const next = !enabledRef.current;
    enabledRef.current = next;
    setEnabled(next);
    try { window.localStorage.setItem(SOUND_STORAGE_KEY, String(next)); } catch { /* current visit still works */ }
    if (next) void engine().unlock();
    else player.current?.stop();
  }, [engine]);

  const play = useCallback((sound?: MoveSound) => {
    if (!sound || !enabledRef.current || document.hidden) return;
    void player.current?.play(sound).catch(() => {});
  }, []);

  return <SoundContext.Provider value={{ enabled, toggle, play }}>{children}</SoundContext.Provider>;
}

export function useBroadcastSound() {
  const value = useContext(SoundContext);
  if (!value) throw new Error('Broadcast sounds require BroadcastSoundProvider');
  return value;
}

export function BroadcastSoundToggle() {
  const { enabled, toggle } = useBroadcastSound();
  return <Translated><button type="button" onClick={toggle} aria-pressed={enabled}
    aria-label="Move sounds" title={enabled ? 'Mute move sounds' : 'Enable move sounds'}>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M11 5 6 9H3v6h3l5 4V5Z" />
      {enabled ? <><path d="M15 8a6 6 0 0 1 0 8M18 5a10 10 0 0 1 0 14" /></> : <path d="m16 9 6 6m0-6-6 6" />}
    </svg><span>Sound {enabled ? 'on' : 'off'}</span>
  </button></Translated>;
}

export function useLiveBroadcastSound(games: BroadcastGame[], active: boolean, snapshotVersion: number) {
  const { play } = useBroadcastSound();
  const previous = useRef<{ games: BroadcastGame[]; active: boolean; snapshotVersion: number } | null>(null);
  useEffect(() => {
    const before = previous.current;
    previous.current = { games, active, snapshotVersion };
    if (!active || !before?.active || before.snapshotVersion !== snapshotVersion) return;
    play(liveMoveSound(before.games, games));
  }, [games, active, snapshotVersion, play]);
}
