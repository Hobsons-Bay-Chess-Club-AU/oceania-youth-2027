import type { BroadcastGame } from './lichess-broadcast';

export type MoveSound = 'move' | 'capture' | 'check' | 'checkmate';
export const SOUND_STORAGE_KEY = 'oy27-broadcast-sound';
const priority: Record<MoveSound, number> = { move: 0, capture: 1, check: 2, checkmate: 3 };

export function readSoundPreference(value: string | null) { return value !== 'false'; }

export function moveSound(san?: string): MoveSound | undefined {
  if (!san) return undefined;
  if (san.includes('#')) return 'checkmate';
  if (san.includes('+')) return 'check';
  return san.includes('x') ? 'capture' : 'move';
}

export function liveMoveSound(previous: BroadcastGame[], games: BroadcastGame[]): MoveSound | undefined {
  const old = new Map(previous.map(game => [game.id, game]));
  let strongest: MoveSound | undefined;
  for (const game of games) {
    const before = old.get(game.id);
    if (!before || game.positions.length <= before.positions.length) continue;
    // Ignore takebacks/corrections and only notify genuinely appended moves.
    if (!before.positions.every((position, index) => position.fen === game.positions[index]?.fen)) continue;
    const sound = moveSound(game.positions.at(-1)?.san);
    if (sound && (!strongest || priority[sound] > priority[strongest])) strongest = sound;
  }
  return strongest;
}

export function replayMoveSound(game: BroadcastGame, from: number, to: number): MoveSound | undefined {
  if (from === to || to < 0 || to >= game.positions.length) return undefined;
  return to === 0 ? 'move' : moveSound(game.positions[to].san);
}

// Original, short synthesized cues; no assets, licensing or download delay.
const tones: Record<MoveSound, readonly (readonly [number, number, number])[]> = {
  move: [[300, 0, 0.065]],
  capture: [[190, 0, 0.09], [135, 0.055, 0.075]],
  check: [[660, 0, 0.095], [880, 0.10, 0.12]],
  checkmate: [[523.25, 0, 0.12], [659.25, 0.12, 0.12], [783.99, 0.24, 0.20]],
};

export class BroadcastSoundPlayer {
  private context?: AudioContext;
  private ready: Promise<boolean> = Promise.resolve(false);
  private voices: { oscillator: OscillatorNode; gain: GainNode }[] = [];
  private generation = 0;
  private lastTime = -Infinity;
  private lastSound: MoveSound = 'move';
  private factory: () => AudioContext;

  constructor(factory: () => AudioContext) { this.factory = factory; }

  // Called from a user gesture. Live network events never create/resume audio.
  unlock() {
    try {
      if (!this.context || this.context.state === 'closed') this.context = this.factory();
      const context = this.context;
      this.ready = (context.state === 'running' ? Promise.resolve() : context.resume())
        .then(() => context.state === 'running').catch(() => false);
    } catch { this.ready = Promise.resolve(false); }
    return this.ready;
  }

  async play(sound: MoveSound) {
    const generation = this.generation;
    if (!await this.ready || generation !== this.generation) return;
    const context = this.context;
    if (!context || context.state !== 'running') return;
    const now = context.currentTime;
    // Coalesce near-simultaneous boards; a higher-priority event can replace it.
    if (now - this.lastTime < 0.12 && priority[sound] <= priority[this.lastSound]) return;
    this.stopVoices();
    this.lastTime = now;
    this.lastSound = sound;
    for (const [frequency, delay, duration] of tones[sound]) {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const start = now + delay;
      oscillator.type = sound === 'move' || sound === 'capture' ? 'triangle' : 'sine';
      oscillator.frequency.setValueAtTime(frequency, start);
      if (sound === 'move' || sound === 'capture') oscillator.frequency.exponentialRampToValueAtTime(frequency * 0.45, start + duration);
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.13, start + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(start);
      oscillator.stop(start + duration + 0.01);
      this.voices.push({ oscillator, gain });
    }
  }

  private stopVoices() {
    for (const { oscillator, gain } of this.voices) {
      try { oscillator.stop(); } catch { /* already ended */ }
      oscillator.disconnect();
      gain.disconnect();
    }
    this.voices = [];
  }

  stop() {
    this.generation++;
    this.lastTime = -Infinity;
    this.stopVoices();
  }

  close() {
    this.stop();
    void this.context?.close().catch(() => {});
    this.context = undefined;
  }
}
