import assert from 'node:assert/strict';
import { test } from 'node:test';
import { parseBroadcastPgn, syncBroadcastClocks, broadcastClock, broadcastPlayerScore } from '../lib/lichess-broadcast.ts';
const pgn = (moves = '1. e4 { [%clk 0:05:00] } e5 { [%clk 0:04:58] } *', result = '*') => `[Event "Live"]\n[White "A"]\n[Black "B"]\n[Result "${result}"]\n\n${moves.replace(/\*$/, result)}`;
const parse = (...args) => parseBroadcastPgn(pgn(...args)).games;

test('only the side to move counts down, never below zero', () => {
  const [game] = syncBroadcastClocks(parse(), [], 1000);
  assert.deepEqual(broadcastClock(game, 2, 'w', 3500), { text: '4:58', running: true, lowTime: false });
  assert.deepEqual(broadcastClock(game, 2, 'b', 3500), { text: '4:58', running: false, lowTime: false });
  assert.equal(broadcastClock(game, 2, 'w', 999999).text, '0:00');
});

test('identical polls and annotation updates preserve the anchor; new moves resync', () => {
  const first = syncBroadcastClocks(parse(), [], 1000);
  const annotated = parse('1. e4 { [%clk 0:05:00] [%eval 0.3] } e5 { [%clk 0:04:58] } *');
  const same = syncBroadcastClocks(annotated, first, 61000);
  assert.equal(broadcastClock(same[0], 2, 'w', 61000).text, '4:00');
  const next = syncBroadcastClocks(parse('1. e4 { [%clk 0:05:00] } e5 { [%clk 0:04:58] } 2. Nf3 { [%clk 0:03:59] } *'), same, 62000);
  assert.equal(broadcastClock(next[0], 3, 'b', 64000).text, '4:56');
  assert.equal(broadcastClock(next[0], 3, 'w', 64000).text, '3:59');
  const corrected = syncBroadcastClocks(parse('1. e4 { [%clk 0:04:50] } e5 { [%clk 0:04:58] } *'), same, 62000);
  assert.equal(broadcastClock(corrected[0], 2, 'w', 63000).text, '4:49');
});

test('completed games, replay and missing clocks remain recorded', () => {
  const [game] = syncBroadcastClocks(parse(), [], 1000);
  assert.deepEqual(broadcastClock(game, 1, 'w', 9000), { text: '5:00', running: false, lowTime: false });
  assert.equal(broadcastClock(game, 2, 'w', 9000, false).text, '5:00');
  const [ended] = syncBroadcastClocks(parse(undefined, '1-0'), [game], 2000);
  assert.deepEqual(broadcastClock(ended, 2, 'w', 9000), { text: '5:00', running: false, lowTime: false });
  const [empty] = syncBroadcastClocks(parse('*'), [], 1000);
  assert.deepEqual(broadcastClock(empty, 0, 'w', 9000), { text: '—', running: false, lowTime: false });
});

test('terminal board with result still pending never ticks', () => {
  const [mate] = syncBroadcastClocks(parse('1. f3 e5 2. g4 { [%clk 0:05:00] } Qh4# { [%clk 0:04:58] } *'), [], 1000);
  assert.equal(broadcastClock(mate, 4, 'w', 9000).running, false);
});

test('fractional clocks use wall time after background suspension and tolerate a backwards wall clock', () => {
  const [game] = syncBroadcastClocks(parse('1. e4 { [%clk 0:00:10.5] } e5 { [%clk 0:00:09.5] } *'), [], 1000);
  assert.equal(broadcastClock(game, 2, 'w', 2500).text, '0:09');
  assert.equal(broadcastClock(game, 2, 'w', 9000).text, '0:03');
  assert.equal(broadcastClock(game, 2, 'w', 500).text, '0:11');
});


test('zero-hour clocks use minutes:seconds; hour clocks keep hours', () => {
  const [game] = syncBroadcastClocks(parse('1. e4 { [%clk 1:00:00] } e5 { [%clk 0:04:08] } *'), [], 1000);
  assert.equal(broadcastClock(game, 2, 'w', 1000).text, '1:00:00');
  assert.equal(broadcastClock(game, 2, 'w', 2000).text, '59:59');
  assert.equal(broadcastClock(game, 2, 'b', 2000).text, '4:08');
  assert.equal(broadcastClock(game, 1, 'w', 2000).text, '1:00:00');
});

test('low-time warning starts below 20 displayed seconds for live and recorded clocks', () => {
  const [game] = syncBroadcastClocks(parse('1. e4 { [%clk 0:00:20] } e5 { [%clk 0:00:19] } *'), [], 1000);
  assert.equal(broadcastClock(game, 2, 'w', 1000).lowTime, false);
  assert.equal(broadcastClock(game, 2, 'w', 2000).lowTime, true);
  assert.equal(broadcastClock(game, 2, 'w', 2000).text, '0:19');
  assert.equal(broadcastClock(game, 2, 'b', 2000).lowTime, true);
  assert.equal(broadcastClock(game, 1, 'w', 2000).lowTime, false);
  assert.equal(broadcastClock(game, 2, 'w', 999999).lowTime, true);
});


test('finished games replace each clock with the correct colored score', () => {
  assert.deepEqual(broadcastPlayerScore('1-0','w'),{text:'1',outcome:'win'});
  assert.deepEqual(broadcastPlayerScore('1-0','b'),{text:'0',outcome:'loss'});
  assert.deepEqual(broadcastPlayerScore('0-1','w'),{text:'0',outcome:'loss'});
  assert.deepEqual(broadcastPlayerScore('0-1','b'),{text:'1',outcome:'win'});
  for(const color of ['w','b']) assert.deepEqual(broadcastPlayerScore('1/2-1/2',color),{text:'½',outcome:'draw'});
  for(const result of [undefined,'*','?']) assert.equal(broadcastPlayerScore(result,'w'),undefined);
});
