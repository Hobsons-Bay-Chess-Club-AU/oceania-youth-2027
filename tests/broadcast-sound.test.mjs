import assert from 'node:assert/strict';
import { test } from 'node:test';
import { parseBroadcastPgn } from '../lib/lichess-broadcast.ts';
import { moveSound, liveMoveSound, replayMoveSound, readSoundPreference, BroadcastSoundPlayer } from '../lib/broadcast-sound.ts';
const game = (moves, id='game0001') => parseBroadcastPgn(`[Event "Youth"]\n[White "A"]\n[Black "B"]\n[GameURL "https://lichess.org/broadcast/${id}"]\n[Result "*"]\n\n${moves} *`).games[0];

test('sounds prioritize mate then check then capture then ordinary moves', () => {
  assert.equal(moveSound('e4'), 'move');
  assert.equal(moveSound('O-O'), 'move');
  assert.equal(moveSound('exd6'), 'capture');
  assert.equal(moveSound('Qxf7+'), 'check');
  assert.equal(moveSound('Qxf7#'), 'checkmate');
  assert.equal(moveSound('a8=Q+'), 'check');
  assert.equal(moveSound(undefined), undefined);
});

test('only appended live moves sound, not initial load, equal updates, corrections or newly discovered games', () => {
  const first = game('1. e4 e5');
  const next = game('1. e4 e5 2. Nf3');
  assert.equal(liveMoveSound([], [first]), undefined);
  assert.equal(liveMoveSound([first], [next]), 'move');
  assert.equal(liveMoveSound([first], [first]), undefined);
  assert.equal(liveMoveSound([next], [first]), undefined);
  assert.equal(liveMoveSound([first], [game('1. d4 d5 2. c4')]), undefined);
  assert.equal(liveMoveSound([first], [game('1. d4 d5', 'other001')]), undefined);
});

test('batched live updates play the strongest event once', () => {
  const old = [game('1. f3 e5 2. g4'), game('1. e4 e5', 'game0002')];
  const next = [game('1. f3 e5 2. g4 Qh4#'), game('1. e4 e5 2. Nf3', 'game0002')];
  assert.equal(liveMoveSound(old, next), 'checkmate');
});

test('replay uses destination move sounds and stays silent at unchanged boundaries', () => {
  const g = game('1. e4 d5 2. exd5 Qxd5 3. Nc3 Qe5+');
  assert.equal(replayMoveSound(g, 2, 3), 'capture');
  assert.equal(replayMoveSound(g, 5, 6), 'check');
  assert.equal(replayMoveSound(g, 4, 3), 'capture');
  assert.equal(replayMoveSound(g, 1, 0), 'move');
  assert.equal(replayMoveSound(g, 0, 0), undefined);
  assert.equal(replayMoveSound(g, 6, 6), undefined);
});

test('sound defaults on, persists an explicit mute and safely handles invalid preferences', () => {
  assert.equal(readSoundPreference(null), true);
  assert.equal(readSoundPreference('true'), true);
  assert.equal(readSoundPreference('false'), false);
  assert.equal(readSoundPreference('broken'), true);
});


function audioFixture() {
  const voices = [];
  const context = {
    state: 'suspended', currentTime: 0, destination: {},
    async resume() { this.state = 'running'; },
    async close() { this.state = 'closed'; },
    createOscillator() {
      const voice = { disconnected: false, frequency: { setValueAtTime() {}, exponentialRampToValueAtTime() {} },
        connect() {}, disconnect() { this.disconnected = true; }, start() {}, stop() {} };
      voices.push(voice); return voice;
    },
    createGain() { return { gain: { setValueAtTime() {}, linearRampToValueAtTime() {}, exponentialRampToValueAtTime() {} }, connect() {}, disconnect() {} }; },
  };
  let creations = 0;
  const player = new BroadcastSoundPlayer(() => { creations++; return context; });
  return { player, context, voices, creations: () => creations };
}

test('audio stays silent until gesture activation; mute also cancels pending playback', async () => {
  const {player, context, voices, creations} = audioFixture();
  await player.play('move');
  assert.equal(creations(), 0);
  await player.unlock();
  await player.play('move');
  assert.equal(voices.length, 1);
  const pending = player.play('checkmate');
  player.stop();
  await pending;
  assert.equal(voices.length, 1);
  assert.equal(voices[0].disconnected, true);
  player.close();
  assert.equal(context.state, 'closed');
});

test('near-simultaneous boards coalesce, allowing a stronger sound to replace a weaker one', async () => {
  const {player, context, voices} = audioFixture();
  await player.unlock();
  await player.play('move');
  await player.play('move');
  assert.equal(voices.length, 1);
  await player.play('checkmate');
  assert.equal(voices.length, 4);
  assert.equal(voices[0].disconnected, true);
  await player.play('capture');
  assert.equal(voices.length, 4);
  context.currentTime = 1;
  await player.play('capture');
  assert.equal(voices.length, 6);
  player.close();
});
