import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { localizeReactTree } from '../lib/localize-react.ts';
import { createTranslator, localizedHref, translateHtml } from '../lib/i18n.ts';
const translate = createTranslator('fr', { Players: 'Joueurs', 'Your name': 'Votre nom', Information: 'Informations' });
const options = { locale: 'fr', translate, href: value => localizedHref('fr', value), html: value => translateHtml(value, translate) };
const render = node => renderToStaticMarkup(localizeReactTree(node, options));

test('renders translated text and accessibility labels while preserving input values and identifiers', () => {
  const result = render(h('label', { className: 'Players', htmlFor: 'Players' }, 'Your name', h('input', { id: 'Players', name: 'Players', defaultValue: 'Players', placeholder: 'Your name', 'aria-label': 'Your name' })));
  assert.match(result, /class="Players" for="Players"/);
  assert.match(result, /Votre nom/);
  assert.match(result, /name="Players"/);
  assert.match(result, /value="Players"/);
  assert.match(result, /placeholder="Votre nom"/);
});

test('annotates missing text and keeps options and SVG text free of invalid spans', () => {
  assert.match(render(h('p', null, 'Missing text')), /<span lang="en" data-translation-fallback="true">Missing text<\/span>/);
  const option = render(h('select', null, h('option', { value: 'original' }, 'Missing text')));
  assert.match(option, /<option value="original" lang="en">Missing text<\/option>/);
  assert.doesNotMatch(option, /<span/);
  assert.doesNotMatch(render(h('svg', null, h('text', null, 'Missing text'))), /<span/);
});

test('preserves player names and asset URLs, while localizing website links', () => {
  assert.match(render(h('strong', { translate: 'no' }, 'Players')), />Players<\/strong>/);
  assert.match(render(h('a', { href: '/players/' }, 'Players')), /href="\/fr\/players\/">Joueurs/);
  assert.match(render(h('a', { href: '/a.pdf' }, 'Information')), /href="\/a.pdf"/);
});

test('English fallback accessibility labels carry English language metadata', () => {
  const empty = createTranslator('na', {});
  const result = renderToStaticMarkup(localizeReactTree(h('input', { 'aria-label': 'Email address for updates', placeholder: 'Enter your email' }), { ...options, locale: 'na', translate: empty }));
  assert.match(result, /lang="en"/);
});

test('translated button text retains its language when its accessible label falls back', () => {
  const result = render(h('button', { 'aria-label': 'Open player directory' }, 'Players'));
  assert.match(result, /<button aria-label="Open player directory" lang="en">/);
  assert.match(result, /<span lang="fr">Joueurs<\/span>/);
});
