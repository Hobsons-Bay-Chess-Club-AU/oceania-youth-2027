import assert from 'node:assert/strict';
import { test } from 'node:test';
import { LOCALES, isLocale, stripLocalePath, localizedHref, preferredLocale, createTranslator, translateHtml } from '../lib/i18n.ts';

test('registers fifteen languages and matches browser preferences safely', () => {
  assert.equal(LOCALES.length, 15);
  assert.equal(isLocale('../../bad'), false);
  assert.equal(preferredLocale(['fr-CA', 'en-AU']), 'fr');
  assert.equal(preferredLocale(['tpi-PG']), 'tpi');
  assert.equal(preferredLocale(['de-DE']), 'en');
});

test('locale links preserve the page and never rewrite assets or external destinations', () => {
  assert.equal(localizedHref('fr', '/players/?division=U12#list'), '/fr/players/?division=U12#list');
  assert.equal(localizedHref('to', '/fr/news/post/'), '/to/news/post/');
  assert.equal(localizedHref('en', '/fr/schedule/'), '/schedule/');
  assert.equal(localizedHref('fr', '/'), '/fr/');
  for (const href of ['/hero.png', '/players.json', '/a.pdf', 'https://example.com/', 'mailto:a@b.com', '#moves']) assert.equal(localizedHref('fr', href), href);
  assert.equal(stripLocalePath('/fr/players/'), '/players/');
  assert.equal(stripLocalePath('/french/'), '/french/');
});

test('translates exact source text, preserves whitespace and reports fallback', () => {
  const t = createTranslator('fr', { Players: 'Joueurs', 'Round {count}': 'Ronde {count}' });
  assert.deepEqual(t(' Players '), { text: ' Joueurs ', translated: true });
  assert.deepEqual(t('Round 12'), { text: 'Ronde 12', translated: true });
  assert.deepEqual(t('No draft available'), { text: 'No draft available', translated: false });
  assert.deepEqual(t('123'), { text: '123', translated: true });
  assert.deepEqual(t('Joueurs'), { text: 'Joueurs', translated: true });
  assert.deepEqual(createTranslator('en', {})('Players'), { text: 'Players', translated: true });
});

test('translated HTML escapes draft text and annotates fallback without changing links', () => {
  const t = createTranslator('fr', { Welcome: 'Bonjour <visiteur>' });
  assert.equal(translateHtml('<p>Welcome</p><p>More information</p><a href="/a.pdf">PDF</a>', t), '<p>Bonjour &lt;visiteur&gt;</p><p><span lang="en">More information</span></p><a href="/a.pdf"><span lang="en">PDF</span></a>');
});
