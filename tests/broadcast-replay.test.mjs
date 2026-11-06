import assert from 'node:assert/strict';
import { test } from 'node:test';
import { replayPlyForKey } from '../lib/broadcast-replay.ts';

test('Left leaves latest-follow mode and steps backward one move', () => {
  assert.equal(replayPlyForKey(null, 80, 'ArrowLeft'), 79);
  assert.equal(replayPlyForKey(40, 80, 'ArrowLeft'), 39);
});

test('Right steps forward without disabling latest-follow mode at the end', () => {
  assert.equal(replayPlyForKey(40, 80, 'ArrowRight'), 41);
  assert.equal(replayPlyForKey(null, 80, 'ArrowRight'), null);
  assert.equal(replayPlyForKey(80, 80, 'ArrowRight'), 80);
});

test('replay remains within the available history including games without moves', () => {
  assert.equal(replayPlyForKey(0, 80, 'ArrowLeft'), 0);
  assert.equal(replayPlyForKey(null, 0, 'ArrowLeft'), null);
  assert.equal(replayPlyForKey(null, 0, 'ArrowRight'), null);
  assert.equal(replayPlyForKey(90, 80, 'ArrowLeft'), 79);
});
