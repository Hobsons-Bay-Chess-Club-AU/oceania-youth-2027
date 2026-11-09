import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtempSync, mkdirSync, writeFileSync, symlinkSync, rmSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { discoverGallery } from '../lib/gallery.ts';

function fixture() { return mkdtempSync(path.join(os.tmpdir(), 'oy27-gallery-')); }
function put(root, file) { const target = path.join(root, file); mkdirSync(path.dirname(target), { recursive: true }); writeFileSync(target, 'test-image'); }

test('missing and empty photo directories produce an empty gallery', () => {
  const root = fixture();
  try { assert.deepEqual(discoverGallery(path.join(root, 'missing')), []); assert.deepEqual(discoverGallery(root), []); }
  finally { rmSync(root, { recursive: true, force: true }); }
});

test('discovers image albums recursively, naturally sorted, ignoring empty and hidden folders', () => {
  const root = fixture();
  try {
    for (const file of ['02-finals/photo10.JPG', '02-finals/photo2.png', '01-opening-ceremony/a.webp', '01-opening-ceremony/moments/portrait.avif', 'empty/README.md', '.private/secret.jpg', '02-finals/.hidden.png', '02-finals/video.mp4']) put(root, file);
    const albums = discoverGallery(root);
    assert.deepEqual(albums.map(album => album.id), ['01-opening-ceremony', '01-opening-ceremony/moments', '02-finals']);
    assert.equal(albums[0].title, 'Opening ceremony');
    assert.deepEqual(albums[2].photos.map(photo => photo.filename), ['photo2.png', 'photo10.JPG']);
    assert.equal(albums[1].photos[0].src, '/gallery/01-opening-ceremony/moments/portrait.avif');
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('encodes each public URL segment and includes root-level images as Highlights', () => {
  const root = fixture();
  try {
    put(root, 'welcome.jpeg'); put(root, 'Opening day #1/Group 50% & friends.jpg');
    const albums = discoverGallery(root);
    assert.equal(albums[0].title, 'Highlights');
    assert.equal(albums[1].photos[0].src, '/gallery/Opening%20day%20%231/Group%2050%25%20%26%20friends.jpg');
    assert.equal(new Set(albums.flatMap(album => album.photos.map(photo => photo.id))).size, 2);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('does not follow symbolic links outside the gallery directory', () => {
  const root = fixture(); const outside = fixture();
  try {
    put(outside, 'private.jpg');
    symlinkSync(outside, path.join(root, 'linked-album'));
    symlinkSync(path.join(outside, 'private.jpg'), path.join(root, 'linked.jpg'));
    assert.deepEqual(discoverGallery(root), []);
  } finally { rmSync(root, { recursive: true, force: true }); rmSync(outside, { recursive: true, force: true }); }
});
