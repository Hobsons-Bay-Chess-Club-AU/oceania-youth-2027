import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { formatPoints, resultLabel, defaultRound, latestSnapshot, validateTournamentResults } from '../lib/tournament-results.ts';
const data = JSON.parse(readFileSync(new URL('../public/tournament/sample-results.json', import.meta.url), 'utf8'));

test('sample data covers every age/category and all three formats with valid relationships', () => {
  assert.equal(data.isSample, true);
  assert.equal(data.divisions.length, 14);
  assert.deepEqual(data.formats.map(format => format.id), ['classical', 'rapid', 'blitz']);
  assert.deepEqual(validateTournamentResults(data), []);
  for (const division of data.divisions) assert.equal(division.competitions.length, 3);
});

test('standings snapshots agree with completed results and keep ranks intact', () => {
  for (const division of data.divisions) for (const competition of division.competitions) for (const snapshot of competition.standings) {
    const scores = Object.fromEntries(division.players.map(player => [player.id, 0]));
    for (const round of competition.rounds.filter(round => round.number <= snapshot.afterRound)) for (const game of round.pairings) {
      if (!game.result) continue;
      const white = game.result === 'bye' ? game.byePoints ?? 1 : game.result === '1/2-1/2' ? .5 : game.result.startsWith('1-0') ? 1 : 0;
      scores[game.whiteId] += white;
      if (game.blackId) scores[game.blackId] += game.result === '1/2-1/2' ? .5 : 1 - white;
    }
    assert.equal(snapshot.rows.length, division.players.length);
    assert.deepEqual(snapshot.rows.map(row => row.rank), snapshot.rows.map((_, index) => index + 1));
    for (const row of snapshot.rows) assert.equal(row.points, scores[row.playerId], `${division.id}/${competition.formatId}/${snapshot.afterRound}/${row.playerId}`);
  }
});

test('formats half points, live games, draws, forfeits and byes', () => {
  assert.deepEqual([0,.5,1,2.5].map(formatPoints), ['0','½','1','2½']);
  assert.equal(resultLabel({ result: '1/2-1/2' }), '½–½');
  assert.equal(resultLabel({ result: null, status: 'playing' }), 'In progress');
  assert.equal(resultLabel({ result: null, status: 'scheduled' }), '—');
  assert.equal(resultLabel({ result: '1-0F' }), '1–0 F');
  assert.equal(resultLabel({ result: 'bye', byePoints: .5 }), 'Bye · ½');
});

test('defaults to the live round and most recent standing snapshot', () => {
  const competition = data.divisions[0].competitions[0];
  assert.equal(defaultRound(competition), 3);
  assert.equal(latestSnapshot(competition).afterRound, 3);
  assert.equal(defaultRound({ rounds: [{number:1,status:'completed'},{number:2,status:'scheduled'}] }), 1);
});

test('rejects duplicate participants and references outside the selected division', () => {
  const broken = structuredClone(data);
  const round = broken.divisions[0].competitions[0].rounds[0];
  round.pairings[1].whiteId = round.pairings[0].whiteId;
  round.pairings[1].blackId = 'unknown-player';
  const errors = validateTournamentResults(broken);
  assert.ok(errors.some(error => error.includes('paired twice')));
  assert.ok(errors.some(error => error.includes('Unknown player')));
});
