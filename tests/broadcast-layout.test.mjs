import assert from 'node:assert/strict';
import { test } from 'node:test';
import { fullscreenBoardLayout } from '../lib/broadcast-layout.ts';

test('fits six boards in two rows of three using the available height', () => {
  const layout = fullscreenBoardLayout(1200, 800, 6);
  assert.equal(layout.columns, 3);
  assert.equal(layout.cardWidth, 332);
  assert.equal(layout.fits, true);
});

test('keeps all four boards visible in a narrow portrait viewport', () => {
  const layout = fullscreenBoardLayout(320, 600, 4);
  assert.equal(layout.columns, 2);
  assert.equal(layout.cardWidth, 156);
  assert.equal(layout.fits, true);
});

test('fits twenty boards on a large screen without shrinking below readable size', () => {
  const layout = fullscreenBoardLayout(1920, 1080, 20);
  const rows = Math.ceil(20 / layout.columns);
  assert.equal(layout.fits, true);
  assert.ok(layout.cardWidth >= 142);
  assert.ok(layout.columns * layout.cardWidth + (layout.columns - 1) * 8 <= 1920);
  assert.ok(rows * (layout.cardWidth + 64) + (rows - 1) * 8 <= 1080);
});

test('uses scrolling rather than unreadably small boards when a feed cannot fit', () => {
  const layout = fullscreenBoardLayout(1280, 720, 100);
  assert.equal(layout.fits, false);
  assert.equal(layout.columns, 8);
  assert.ok(layout.cardWidth >= 142);
  assert.ok(layout.columns * layout.cardWidth + (layout.columns - 1) * 8 <= 1280);
});

test('handles an unmeasured viewport and empty feeds without invalid CSS dimensions', () => {
  const layout = fullscreenBoardLayout(0, 0, 0);
  assert.ok(Number.isFinite(layout.cardWidth));
  assert.ok(layout.cardWidth > 0);
  assert.equal(layout.columns, 1);
});
