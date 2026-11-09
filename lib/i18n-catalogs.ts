import { readFileSync } from 'node:fs';
import path from 'node:path';
import { isLocale, LOCALES, type Locale, type Messages } from './i18n';

export function getMessages(locale: Locale): Messages {
  if (locale === 'en') return {};
  if (!isLocale(locale)) return {};
  const file = path.join(process.cwd(), 'locales', `${locale}.json`);
  const data = JSON.parse(readFileSync(file, 'utf8'));
  return Object.fromEntries(Object.entries(data).filter((entry): entry is [string, string] => typeof entry[1] === 'string' && !!entry[1].trim()));
}

export function getCatalogueCoverage(): Record<string, number> {
  return Object.fromEntries(LOCALES.map(locale => [locale.code, Object.keys(getMessages(locale.code)).length]));
}
