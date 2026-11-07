import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { test } from 'node:test';
import { PIECE_SETS, DEFAULT_PIECE_SET, PIECE_SET_STORAGE_KEY, validPieceSet, pieceSource, readPieceSet, savePieceSet, FEDERATION_PIECE_SETS, federationCode, playerFederation, resolvePieceSet, buildFederationLookup } from '../lib/broadcast-piece-sets.ts';

test('uses the official Oceania set by default and accepts only registered set IDs', () => {
  assert.equal(DEFAULT_PIECE_SET, 'oceania-2027');
  assert.equal(validPieceSet('oceania-2027'), 'oceania-2027');
  assert.equal(validPieceSet('../../bad'), 'oceania-2027');
  assert.equal(validPieceSet(null), 'oceania-2027');
});

test('every set contains all twelve local piece assets', () => {
  assert.equal(PIECE_SETS.length, 18);
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

test('all thirteen federation sets are available with aliases', () => {
  assert.equal(FEDERATION_PIECE_SETS.length, 13);
  for (const set of FEDERATION_PIECE_SETS) {
    assert.equal(federationCode(set.code.toUpperCase()), set.code);
    assert.equal(federationCode(set.fide), set.code);
    assert.equal(federationCode(set.name), set.code);
  }
  assert.equal(federationCode('FJI'), 'fj');
  assert.equal(federationCode('NCL'), 'nc');
  assert.equal(federationCode('USA'), undefined);
});

test('adaptive resolves sides independently, preferring explicit country data', () => {
  const lookup = { '101': 'nz', '202': 'fj' };
  const headers = { WhiteFideId: '101', BlackFideId: '202', WhiteFederation: 'AUS' };
  assert.equal(playerFederation(headers, 'w', lookup), 'au');
  assert.equal(playerFederation(headers, 'b', lookup), 'fj');
  assert.equal(resolvePieceSet('adaptive', 'au'), 'federation-au');
  assert.equal(resolvePieceSet('adaptive', undefined), 'oceania-2027');
  assert.equal(resolvePieceSet('spatial', 'au'), 'spatial');
  assert.equal(playerFederation({ WhiteCountry: 'USA', WhiteFideId: '101' }, 'w', lookup), undefined);
  assert.equal(playerFederation({ WhiteCountry: 'AUS', WhiteFederation: 'NZL' }, 'w', lookup), undefined);
  assert.equal(playerFederation({ WhiteFideId: '0' }, 'w', lookup), undefined);
});

test('builds a compact lookup and excludes conflicting or invalid IDs', () => {
  assert.deepEqual(buildFederationLookup([
    { fideId: '101', federation: 'AUS' }, { fideId: '101', federation: 'NZL' },
    { fideId: '202', federation: 'FIJ' }, { fideId: '202', federation: 'FIJ' },
    { fideId: '', federation: 'AUS' }, { fideId: '0', federation: 'AUS' },
    { fideId: '303', federation: 'USA' },
    { fideId: '404', federation: 'AUS' }, { fideId: '404', federation: 'USA' },
    { fideId: '505', federation: 'USA' }, { fideId: '505', federation: 'AUS' },
  ]), { '202': 'fj' });
});

test('adaptive and manual federation choices persist like existing sets', () => {
  const values = new Map();
  const storage = { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
  for (const id of ['adaptive', 'federation-pg', 'chessnut']) {
    assert.equal(savePieceSet(storage, id), true);
    assert.equal(readPieceSet(storage), id);
  }
});
