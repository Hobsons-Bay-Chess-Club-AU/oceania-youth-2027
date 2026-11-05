import assert from 'node:assert/strict';
import { test } from 'node:test';
import { Chess } from 'chess.js';
import { parseTournamentConfig, parseBroadcastPgn, fetchBroadcast } from '../lib/lichess-broadcast.ts';

const game = (headers = '', moves = '1. e4 { [%clk 1:29:57] } e5 { [%clk 1:29:54] } 2. Nf3 *') =>
  `[Event "Club Open"]\n[White "Alice"]\n[Black "Bob"]\n[Result "*"]\n[Round "1.1"]\n${headers}\n\n${moves}`;

test('tournament config trims, deduplicates, and rejects non-ID entries', () => {
  const config = parseTournamentConfig(' wsHmdvmw,2sSeYjPm,,wsHmdvmw,../bad ');
  assert.deepEqual(config.tournaments.map(t => t.id), ['wsHmdvmw', '2sSeYjPm']);
  assert.equal(config.tournaments[1].url, 'https://lichess.org/api/broadcast/2sSeYjPm.pgn');
  assert.deepEqual(config.invalidIds, ['../bad']);
  assert.deepEqual(parseTournamentConfig().tournaments, []);
});

test('parses multiple games, keeps full round identifiers, and extracts clock comments', () => {
  const result = parseBroadcastPgn(`${game('[BroadcastName "Open Broadcast"]')}\n\n${game().replace('[Round "1.1"]', '[Round "2.1"]')}`);
  assert.equal(result.games.length, 2);
  assert.deepEqual(result.games.map(g => g.round), ['1.1', '2.1']);
  assert.equal(result.games[0].tournamentName, 'Open Broadcast');
  assert.equal(result.games[0].positions.length, 4);
  assert.equal(result.games[0].positions[3].whiteClock, '1:29:57');
  assert.equal(result.games[0].positions[3].blackClock, '1:29:54');
  assert.equal(new Chess(result.games[0].positions[3].fen).get('f3').type, 'n');
  assert.match(result.games[0].pgn, /%clk/);
});

test('supports custom FEN and promotion', () => {
  const result = parseBroadcastPgn(game('[SetUp "1"]\n[FEN "7k/P7/8/8/8/8/8/7K w - - 0 1"]', '1. a8=Q+ *'));
  assert.equal(result.games.length, 1);
  assert.equal(new Chess(result.games[0].positions[1].fen).get('a8').type, 'q');
});

test('supports castling, en passant, variations and comments without treating them as games', () => {
  const castle = parseBroadcastPgn(game('', '1. e4 e5 2. Nf3 Nc6 3. Bc4 Nf6 4. O-O *')).games[0];
  assert.equal(new Chess(castle.positions.at(-1).fen).get('g1').type, 'k');
  const ep = parseBroadcastPgn(game('', '1. e4 a6 2. e5 d5 3. exd6 *')).games[0];
  assert.equal(new Chess(ep.positions.at(-1).fen).get('d5'), undefined);
  const annotated = parseBroadcastPgn(game('', '1. e4 {note\n[Event "not a game"]\n} (1. d4 d5) e5 *'));
  assert.equal(annotated.games.length, 1);
  assert.equal(annotated.games[0].positions.length, 3);
});

test('keeps valid games when another game is malformed or an unsupported variant', () => {
  const result = parseBroadcastPgn(`${game('', '1. Qh9 *')}\n\n${game('[Variant "Atomic"]')}\n\n${game()}`);
  assert.equal(result.games.length, 1);
  assert.equal(result.errors.length, 2);
  assert.deepEqual(parseBroadcastPgn('').games, []);
  assert.throws(() => parseBroadcastPgn('<html>Unavailable</html>'), /PGN/i);
});

test('game identity stays stable when moves are appended or game order changes', () => {
  const first = parseBroadcastPgn(game()).games[0];
  const updated = parseBroadcastPgn(game('', '1. e4 e5 2. Nf3 Nc6 *')).games[0];
  assert.equal(first.id, updated.id);
});

test('accepts adjacent Lichess analysis and clock comments without changing original PGN', () => {
  const pgn = game('[Site "A } { B"]', '1. e4?! { [%eval 0.83] } { Inaccuracy. d4 was best. } { [%clk 1:14:30] } e5 *');
  const result = parseBroadcastPgn(pgn);
  assert.equal(result.games.length, 1);
  assert.equal(result.games[0].headers.Site, 'A } { B');
  assert.equal(result.games[0].positions[1].whiteClock, '1:14:30');
  assert.equal(result.games[0].positions[1].comment, 'Inaccuracy. d4 was best.');
  assert.equal(result.games[0].pgn, pgn);
});

test('fetch requests PGN with optional bearer auth and reports HTTP/rate-limit failures', async () => {
  const tournament = parseTournamentConfig('wsHmdvmw').tournaments[0];
  let received;
  const fetcher = async (url, options) => {
    received = { url: String(url), options };
    return new Response(game(), { status: 200 });
  };
  const result = await fetchBroadcast(tournament, { token: 'test-token', fetcher });
  assert.equal(result.games.length, 1);
  assert.match(received.url, /clocks=true&comments=true/);
  assert.equal(received.options.headers.Authorization, 'Bearer test-token');
  await fetchBroadcast(tournament, { fetcher });
  assert.equal(received.options.headers.Authorization, undefined);
  await assert.rejects(fetchBroadcast(tournament, { fetcher: async () => new Response('', { status: 429, headers: { 'Retry-After': '120' } }) }), /120/);
  await assert.rejects(fetchBroadcast(tournament, { fetcher: async () => new Response('', { status: 404 }) }), /404/);
});

for (const [variant, interval] of [['Standard', 60000], ['Rapid', 15000], ['Blitz', 5000], [' blitz ', 5000], [undefined, 60000]]) {
  test(`refreshes ${variant || 'untagged'} broadcasts every ${interval / 1000} seconds despite upstream cache lifetime`, async () => {
    const tournament = parseTournamentConfig('wsHmdvmw').tournaments[0];
    let requestOptions;
    const feed = await fetchBroadcast(tournament, { fetcher: async (_url, options) => {
      requestOptions = options;
      return new Response(game(variant ? `[Variant "${variant}"]` : ''), { headers: { 'Cache-Control': 'public, max-age=600' } });
    } });
    assert.equal(feed.games.length, 1);
    assert.equal(feed.refreshAfterMs, interval);
    assert.equal(requestOptions.cache, 'no-store');
  });
}

test('uses the fastest refresh interval when a feed contains several game speeds', async () => {
  const tournament = parseTournamentConfig('wsHmdvmw').tournaments[0];
  const pgn = ['Standard', 'Rapid', 'Blitz'].map(variant => game(`[Variant "${variant}"]`)).join('\n\n');
  const feed = await fetchBroadcast(tournament, { fetcher: async () => new Response(pgn) });
  assert.equal(feed.games.length, 3);
  assert.equal(feed.refreshAfterMs, 5000);
  const empty = await fetchBroadcast(tournament, { fetcher: async () => new Response('') });
  assert.equal(empty.refreshAfterMs, 60000);
});
