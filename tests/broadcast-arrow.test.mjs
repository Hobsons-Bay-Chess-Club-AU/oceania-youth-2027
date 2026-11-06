import assert from 'node:assert/strict';
import { test } from 'node:test';
import { boardMoveArrow } from '../lib/broadcast-arrow.ts';

test('points between square centers for adjacent pawn moves', () => {
  assert.deepEqual(boardMoveArrow('e2', 'e3'), { x1: 4.5, y1: 6.5, x2: 4.5, y2: 5.5 });
});

test('rotates both arrow endpoints with the flipped board', () => {
  assert.deepEqual(boardMoveArrow('e2', 'e3', true), { x1: 3.5, y1: 1.5, x2: 3.5, y2: 2.5 });
});

test('supports diagonal, knight and castling moves', () => {
  assert.deepEqual(boardMoveArrow('e4', 'd5'), { x1: 4.5, y1: 4.5, x2: 3.5, y2: 3.5 });
  assert.deepEqual(boardMoveArrow('g1', 'f3'), { x1: 6.5, y1: 7.5, x2: 5.5, y2: 5.5 });
  assert.deepEqual(boardMoveArrow('e1', 'g1'), { x1: 4.5, y1: 7.5, x2: 6.5, y2: 7.5 });
});

test('omits the arrow for an initial position, invalid squares, or identical endpoints', () => {
  for (const [from, to] of [[undefined, undefined], ['e2', undefined], ['a0', 'b1'], ['a1', 'i9'], ['e2', 'e2']]) {
    assert.equal(boardMoveArrow(from, to), null);
  }
});
