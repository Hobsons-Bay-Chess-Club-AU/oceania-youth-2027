import assert from 'node:assert/strict';
import { test } from 'node:test';
import { parseBroadcastPgn, streamBroadcast, mergeBroadcastGames, followBroadcast, broadcastClock } from '../lib/lichess-broadcast.ts';

const pgn = (id = 'game0001', moves = '1. e4 { [%clk 0:05:00] } e5 { [%clk 0:04:58] } *', round = '1.1') =>
  `[Event "Youth"]\n[White "Moana"]\n[Black "José"]\n[GameURL "https://lichess.org/broadcast/${id}"]\n[Round "${round}"]\n[Result "${moves.endsWith('*') ? '*' : '1-0'}"]\n\n${moves}\n\n\n`;
const tournament = { id: '7RDzDzcy', url: 'https://lichess.org/api/broadcast/7RDzDzcy.pgn' };
const encode = new TextEncoder();
const response = text => new Response(text, { headers: { 'Content-Type': 'application/x-chess-pgn' } });

test('stream decodes arbitrary byte boundaries and emits games before the connection closes', async () => {
  let source;
  let received;
  const controller = new AbortController();
  const updates = [];
  const first = pgn();
  const second = pgn('game0002', '1. d4 { note\n[Event "not a game"]\n* 1-0\n} d5 *', '1.2');
  const done = streamBroadcast(tournament, { signal: controller.signal, token: 'test-token', onGames: data => updates.push(data), fetcher: async (url, options) => {
    received = { url: String(url), options };
    return new Response(new ReadableStream({ start(c) { source = c; } }));
  } });
  await new Promise(resolve => setImmediate(resolve));
  for (const byte of encode.encode(first + second)) source.enqueue(Uint8Array.of(byte));
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(updates.length, 2);
  assert.equal(updates[0].games[0].headers.Black, 'José');
  assert.equal(updates[1].games[0].positions.length, 3);
  assert.match(received.url, /\/api\/stream\/broadcast\/tour\/7RDzDzcy.pgn\?clocks=true&comments=true/);
  assert.equal(received.options.headers.Authorization, 'Bearer test-token');
  assert.equal(received.options.cache, 'no-store');
  source.close();
  await done;
});

test('stream accepts CRLF, heartbeats, several messages per chunk and final PGN without newline', async () => {
  const updates = [];
  await streamBroadcast(tournament, { onGames: data => updates.push(data), fetcher: async () => response('\n\n' + pgn().replaceAll('\n', '\r\n') + pgn('game0002').trim()) });
  assert.equal(updates.flatMap(data => data.games).length, 2);
});

test('malformed complete games are isolated and incomplete final games are never applied', async () => {
  const updates = [];
  await streamBroadcast(tournament, { onGames: data => updates.push(data), fetcher: async () => response(pgn('broken01', '1. Qh9 *') + pgn()) });
  assert.equal(updates.flatMap(data => data.errors).length, 1);
  assert.equal(updates.flatMap(data => data.games).length, 1);
  await assert.rejects(streamBroadcast(tournament, { onGames: () => assert.fail('partial PGN applied'), fetcher: async () => response(pgn().replace(/\*\s*$/, '')) }), /incomplete/i);
});

test('abort cancels an idle stream and releases its reader', async () => {
  const controller = new AbortController();
  let cancelled = false;
  const done = streamBroadcast(tournament, { signal: controller.signal, onGames() {}, fetcher: async () => new Response(new ReadableStream({ cancel() { cancelled = true; } })) });
  await new Promise(resolve => setImmediate(resolve));
  controller.abort();
  await done;
  assert.equal(cancelled, true);
});

test('HTTP rate limit carries Retry-After; authentication errors explain study:read', async () => {
  await assert.rejects(streamBroadcast(tournament, { onGames() {}, fetcher: async () => new Response('', { status: 429, headers: { 'Retry-After': '120' } }) }), error => error.retryAfterMs === 120000);
  await assert.rejects(streamBroadcast(tournament, { onGames() {}, fetcher: async () => new Response('', { status: 403 }) }), /study:read/);
});

test('merging preserves historical games, identities, board numbering and unchanged clock anchors', () => {
  const past = parseBroadcastPgn(pgn('oldgame1', '1. e4 e5 1-0', '1.1')).games;
  const live = parseBroadcastPgn(pgn()).games;
  const initial = mergeBroadcastGames([], [...past, ...live], 1000);
  const same = mergeBroadcastGames(initial, live, 61000);
  assert.equal(same.length, 2);
  assert.equal(same[0], initial[0]);
  assert.equal(broadcastClock(same[1], 2, 'w', 61000).text, '4:00');
  const updated = mergeBroadcastGames(same, parseBroadcastPgn(pgn('game0001', '1. e4 e5 2. Nf3 *')).games, 62000);
  assert.equal(updated.length, 2);
  assert.equal(updated[1].positions.length, 4);
  assert.equal(updated[1].id, initial[1].id);
  const newGame = mergeBroadcastGames(updated, parseBroadcastPgn(pgn('game0003', '1. d4 *', '2.1')).games, 62000);
  assert.equal(newGame.length, 3);
});

test('follower loads once, reconnects streams without polling, and backs off on repeated failure', async () => {
  const controller = new AbortController();
  const urls = [];
  const delays = [];
  const updates = [];
  await followBroadcast(tournament, { signal: controller.signal, onGames: (data, snapshot) => updates.push({ data, snapshot }), onState() {},
    fetcher: async url => {
      urls.push(String(url));
      return String(url).includes('/stream/') ? response('') : response(pgn());
    },
    wait: async ms => { delays.push(ms); if (delays.length === 3) controller.abort(); },
  });
  assert.equal(urls.filter(url => !url.includes('/stream/')).length, 1);
  assert.equal(urls.filter(url => url.includes('/stream/')).length, 3);
  assert.deepEqual(delays, [5000, 10000, 20000]);
  assert.equal(updates[0].snapshot, true);
});

test('follower respects Retry-After and cancels reconnects when stopped', async () => {
  const controller = new AbortController();
  const calls = [];
  await followBroadcast(tournament, { signal: controller.signal, onGames() {}, onState() {},
    fetcher: async url => { calls.push(url); return new Response('', { status: 429, headers: { 'Retry-After': '120' } }); },
    wait: async ms => { assert.equal(ms, 120000); controller.abort(); },
  });
  assert.equal(calls.length, 1);
});

test('new games without Board or compound Round tags get distinct board numbers', () => {
  const initial = mergeBroadcastGames([], parseBroadcastPgn(pgn('game0001', '1. e4 *', '2')).games, 1000);
  const next = mergeBroadcastGames(initial, parseBroadcastPgn(pgn('game0002', '1. d4 *', '2')).games, 2000);
  assert.deepEqual(next.map(game => game.board), ['1', '2']);
  const updated = mergeBroadcastGames(next, parseBroadcastPgn(pgn('game0002', '1. d4 d5 *', '2')).games, 3000);
  assert.equal(updated[1].board, '2');
});

test('stopping during initial snapshot prevents games and streaming callbacks', async () => {
  const controller = new AbortController();
  let resolveFetch;
  const done = followBroadcast(tournament, { signal: controller.signal, onGames() { assert.fail('received data after stopping'); }, onState() {}, fetcher: () => new Promise(resolve => { resolveFetch = resolve; }) });
  controller.abort();
  resolveFetch(response(pgn()));
  await done;
});

test('a healthy connection resets backoff even when its reader later throws', async t => {
  let now = 1000;
  t.mock.method(Date, 'now', () => now);
  const controller = new AbortController();
  const delays = [];
  let streams = 0;
  await followBroadcast(tournament, { signal: controller.signal, onGames() {}, onState() {},
    fetcher: async url => {
      if (!String(url).includes('/stream/')) return response(pgn());
      streams++;
      if (streams !== 2) return response('');
      return new Response(new ReadableStream({ pull(source) { now += 61000; source.error(new Error('network reset')); } }));
    },
    wait: async ms => { delays.push(ms); if (delays.length === 3) controller.abort(); },
  });
  assert.deepEqual(delays, [5000, 5000, 10000]);
});
