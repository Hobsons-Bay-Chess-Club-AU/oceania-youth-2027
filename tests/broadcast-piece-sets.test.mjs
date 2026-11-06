import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { test } from 'node:test';
import { PIECE_SETS, DEFAULT_PIECE_SET, PIECE_SET_STORAGE_KEY, validPieceSet, pieceSource, readPieceSet, savePieceSet } from '../lib/broadcast-piece-sets.ts';

test('uses the official Oceania set by default and accepts only registered set IDs', () => {
  assert.equal(DEFAULT_PIECE_SET, 'oceania-2027');
  assert.equal(validPieceSet('oceania-2027'), 'oceania-2027');
  assert.equal(validPieceSet('../../bad'), 'oceania-2027');
  assert.equal(validPieceSet(null), 'oceania-2027');
});

test('every set contains all twelve local piece assets', () => {
  assert.equal(PIECE_SETS.length, 5);
  for (const set of PIECE_SETS) for (const color of ['w', 'b']) for (const type of ['k', 'q', 'r', 'b', 'n', 'p']) {
    const source = pieceSource(set.id, color, type);
    assert.ok(existsSync(new URL('../public' + source, import.meta.url)), source);
    assert.ok(readFileSync(new URL('../public' + source, import.meta.url)).length > 0);
  }
  assert.equal(pieceSource('chessnut', 'w', 'k'), '/chess/wK.svg');
  assert.equal(pieceSource('staunton', 'b', 'n'), '/chess/staunton/bN.webp');
});

test('stores the selected set and restores it after a new read', () => {
  const values = new Map();
  const storage = { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
  assert.equal(readPieceSet(storage), 'oceania-2027');
  assert.equal(savePieceSet(storage, 'oceania-2027'), true);
  assert.equal(values.get(PIECE_SET_STORAGE_KEY), 'oceania-2027');
  assert.equal(readPieceSet(storage), 'oceania-2027');
});

test('unavailable storage and obsolete preferences fall back safely', () => {
  const blocked = { getItem() { throw new Error('Blocked'); }, setItem() { throw new Error('Blocked'); } };
  assert.equal(readPieceSet(blocked), 'oceania-2027');
  assert.equal(savePieceSet(blocked, 'spatial'), false);
  assert.equal(readPieceSet({ getItem: () => 'removed-set' }), 'oceania-2027');
});

test('preserves an explicitly saved alternative when the default changes', () => {
  assert.equal(readPieceSet({ getItem: () => 'chessnut' }), 'chessnut');
});
