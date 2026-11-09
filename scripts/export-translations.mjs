import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const root = process.cwd();
const locales = ['fr', 'mi', 'fj', 'hif', 'tpi', 'ho', 'pis', 'pau', 'ch', 'na', 'to', 'bi', 'gil', 'mh'];
const humanProps = new Set(['title', 'description', 'eyebrow', 'label', 'placeholder', 'alt', 'aria-label', 'aria-description']);
const ignoredProps = new Set(['href', 'src', 'className', 'id', 'key', 'name', 'value', 'type', 'slug', 'date', 'email', 'fideId', 'federation', 'flag', 'directory', 'extension', 'code', 'fide']);
const source = new Set();
function add(value) {
  const text = value.trim().replace(/\s+/g, ' ').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ');
  if (!/[A-Za-z]/.test(text) || text.length < 3 || /^(https?:|mailto:|[\/#@])/.test(text) || /\.(svg|png|webp|json|pdf|ts|tsx)$/.test(text)) return;
  if (/^[a-z]+(?:-[a-z0-9]+)+$/.test(text) || text.includes('=>') || text.includes('process.env')) return;
  source.add(text);
}
function scan(file) {
  const text = fs.readFileSync(file, 'utf8');
  const ast = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, file.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  function visit(node) {
    if (ts.isJsxText(node)) add(node.text);
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
      const parent = node.parent;
      if (ts.isJsxAttribute(parent)) { if (humanProps.has(parent.name.getText(ast))) add(node.text); }
      else if (ts.isJsxExpression(parent)) add(node.text);
      else if (!ts.isImportDeclaration(parent) && !ts.isExportDeclaration(parent)) {
        let ancestor = parent;
        let skip = false;
        for (let i = 0; ancestor && i < 4; i++, ancestor = ancestor.parent) {
          if (ts.isJsxAttribute(ancestor)) { skip = !humanProps.has(ancestor.name.getText(ast)); break; }
          if (ts.isPropertyAssignment(ancestor) && ignoredProps.has(ancestor.name.getText(ast).replace(/["']/g, ''))) { skip = true; break; }
        }
        if (!skip && (node.text.includes(' ') || humanProps.has(ts.isPropertyAssignment(parent) ? parent.name.getText(ast) : ''))) add(node.text);
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(ast);
}
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.tsx?$/.test(entry.name)) scan(full);
  }
}
walk(path.join(root, 'components'));
walk(path.join(root, 'app'));
scan(path.join(root, 'lib/news.ts'));
const dictionaries = Object.fromEntries(locales.map(locale => {
  const messages = JSON.parse(fs.readFileSync(path.join(root, 'locales', `${locale}.json`), 'utf8'));
  for (const [key, value] of Object.entries(messages)) {
    if (typeof value !== 'string' || !value.trim() || !key.trim() || key !== key.trim().replace(/\s+/g, ' ')) throw new Error(`Invalid translation entry in ${locale}: ${key}`);
    const placeholders = text => [...text.matchAll(/\{(\w+)\}/g)].map(match => match[1]).sort().join(',');
    if (placeholders(key) !== placeholders(value)) throw new Error(`Placeholder mismatch in ${locale}: ${key}`);
    source.add(key);
  }
  return [locale, messages];
}));
const keys = [...source].sort();
const out = path.join(root, 'public/translations');
fs.mkdirSync(path.join(out, 'review'), { recursive: true });
const csv = value => `"${String(value).replace(/"/g, '""')}"`;
const manifest = {};
for (const locale of locales) {
  const messages = dictionaries[locale];
  const rows = [['English source', 'Draft translation', 'Review status'], ...keys.map(key => [key, messages[key] || '', messages[key] ? 'AI draft — needs federation review' : 'English fallback — translation needed'])];
  fs.writeFileSync(path.join(out, 'review', `${locale}.csv`), '\ufeff' + rows.map(row => row.map(csv).join(',')).join('\r\n') + '\r\n');
  manifest[locale] = { status: Object.keys(messages).length ? 'partial-draft' : 'review-template', draftEntries: Object.keys(messages).length, sourceEntries: keys.length };
}
fs.writeFileSync(path.join(out, 'source.json'), JSON.stringify(keys, null, 2) + '\n');
fs.writeFileSync(path.join(out, 'coverage.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(`Exported ${keys.length} source entries and ${locales.length} federation review sheets.`);
