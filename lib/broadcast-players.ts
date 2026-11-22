import type { BroadcastGame } from './lichess-broadcast';

export type BroadcastPlayer = { name: string; fideId?: string; fed?: string; title?: string; rating?: number };
const DAY = 24 * 60 * 60 * 1000;
const RETRY = 10 * 60 * 1000;
const meaningful = (value?: string) => !!value?.trim() && !['-', '?'].includes(value.trim());
const fideId = (value: unknown) => /^[1-9]\d*$/.test(String(value ?? '').trim()) ? String(value).trim() : undefined;
const nameKey = (value: string) => value.normalize('NFKC').toLowerCase().replace(/[,\s]+/g, ' ').trim();
const hasFederation = (headers: Record<string, string>, side: string) =>
  ['Federation', 'Fed', 'Country'].some(suffix => meaningful(headers[side + suffix]));

export function needsBroadcastPlayers(games: BroadcastGame[]) {
  return games.some(game => ['White', 'Black'].some(side => !hasFederation(game.headers, side)));
}

export function enrichBroadcastPlayers(games: BroadcastGame[], players: BroadcastPlayer[]) {
  if (!players.length) return games;
  const byId = new Map<string, BroadcastPlayer[]>();
  const byName = new Map<string, BroadcastPlayer[]>();
  for (const player of players) {
    const id = fideId(player.fideId);
    if (id) byId.set(id, [...byId.get(id) || [], player]);
    const key = nameKey(player.name);
    byName.set(key, [...byName.get(key) || [], player]);
  }
  return games.map(game => {
    const headers = { ...game.headers };
    for (const side of ['White', 'Black']) {
      const ids = [...new Set(['FideId', 'FIDEId', 'FIDEID'].map(suffix => fideId(headers[side + suffix])).filter(Boolean))];
      if (ids.length > 1) continue;
      const id = ids[0];
      const matches = id ? byId.get(id) : byName.get(nameKey(headers[side] || ''));
      if (matches?.length !== 1) continue;
      const player = matches[0];
      if (!hasFederation(headers, side) && player.fed) headers[side + 'Federation'] = player.fed;
      if (!id && player.fideId) headers[side + 'FideId'] = player.fideId;
      if (!meaningful(headers[side + 'Title']) && player.title) headers[side + 'Title'] = player.title;
      if (!(Number(headers[side + 'Elo']) > 0) && player.rating) headers[side + 'Elo'] = String(player.rating);
    }
    return { ...game, headers };
  });
}

function parsePlayers(value: unknown): BroadcastPlayer[] {
  if (!Array.isArray(value)) throw new Error('Invalid broadcast player roster');
  return value.flatMap(row => {
    if (!row || typeof row !== 'object' || typeof row.name !== 'string' || !row.name.trim()) return [];
    const player: BroadcastPlayer = { name: row.name.trim() };
    const id = fideId(row.fideId);
    if (id) player.fideId = id;
    if (typeof row.fed === 'string' && /^[A-Za-z]{3}$/.test(row.fed.trim())) player.fed = row.fed.trim().toUpperCase();
    if (typeof row.title === 'string' && /^[A-Za-z]{1,6}$/.test(row.title)) player.title = row.title.toUpperCase();
    if (typeof row.rating === 'number' && Number.isInteger(row.rating) && row.rating > 0 && row.rating < 4000) player.rating = row.rating;
    return [player];
  });
}

// Runs in the static route exporter/server, because the upstream roster route
// lacks CORS headers and cannot be read directly by the deployed browser.
export async function fetchBroadcastPlayerRoster(id: string, fetcher: typeof fetch = fetch) {
  if (!/^[A-Za-z0-9]{8}$/.test(id)) throw new Error('Invalid broadcast tournament ID');
  const response = await fetcher(`https://lichess.org/broadcast/${id}/players`, {
    headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(15_000),
    cache: 'force-cache', next: { revalidate: 86400 },
  });
  if (!response.ok) throw new Error(`Player roster returned HTTP ${response.status}`);
  return parsePlayers(await response.json());
}

type CacheEntry = { players: BroadcastPlayer[]; expiresAt: number };

export function createBroadcastPlayerCache(options: {
  fetcher?: typeof fetch; now?: () => number; storage?: Pick<Storage, 'getItem' | 'setItem'>;
} = {}) {
  const entries = new Map<string, CacheEntry>();
  const pending = new Map<string, Promise<BroadcastPlayer[]>>();
  const now = options.now || Date.now;
  const storage = () => options.storage || (typeof window === 'undefined' ? undefined : window.localStorage);
  return async (id: string): Promise<BroadcastPlayer[]> => {
    if (!/^[A-Za-z0-9]{8}$/.test(id)) return [];
    const key = `oy27-broadcast-players-v1-${id}`;
    let cached = entries.get(id);
    if (!cached) {
      try {
        const raw = storage()?.getItem(key);
        if (raw) {
          const saved = JSON.parse(raw);
          if (typeof saved.expiresAt === 'number' && Number.isFinite(saved.expiresAt)) {
            cached = { players: parsePlayers(saved.players), expiresAt: saved.expiresAt };
            entries.set(id, cached);
          }
        }
      } catch { /* unavailable or obsolete cache */ }
    }
    if (cached && cached.expiresAt > now()) return cached.players;
    const inFlight = pending.get(id);
    if (inFlight) return inFlight;
    const request = (async () => {
      let entry: CacheEntry;
      let retryAfter = RETRY;
      try {
        const response = await (options.fetcher || fetch)(`/broadcast-players/${id}.json`, {
          headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(15_000), cache: 'default',
        });
        if (!response.ok) {
          const retry = response.headers.get('Retry-After') || '';
          retryAfter = Math.max(RETRY, /^\d+$/.test(retry) ? Number(retry) * 1000 : Date.parse(retry) - now() || 0);
          throw new Error('Broadcast player roster unavailable');
        }
        const players = parsePlayers(await response.json());
        entry = { players, expiresAt: now() + (players.length ? DAY : RETRY) };
      } catch {
        entry = { players: cached?.players || [], expiresAt: now() + retryAfter };
      }
      entries.set(id, entry);
      try { storage()?.setItem(key, JSON.stringify(entry)); } catch { /* memory cache still works */ }
      return entry.players;
    })();
    pending.set(id, request);
    try { return await request; } finally { pending.delete(id); }
  };
}

export const loadBroadcastPlayers = createBroadcastPlayerCache();
