export const I18N_ENABLED = process.env.NEXT_PUBLIC_ENABLE_I18N === 'true';

export const LOCALES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'mi', name: 'Māori', nativeName: 'Te reo Māori' },
  { code: 'fj', name: 'Fijian', nativeName: 'Vosa Vakaviti' },
  { code: 'hif', name: 'Fiji Hindi', nativeName: 'Fiji Hindi' },
  { code: 'tpi', name: 'Tok Pisin', nativeName: 'Tok Pisin' },
  { code: 'ho', name: 'Hiri Motu', nativeName: 'Hiri Motu' },
  { code: 'pis', name: 'Solomon Islands Pijin', nativeName: 'Pijin' },
  { code: 'pau', name: 'Palauan', nativeName: 'Palauan' },
  { code: 'ch', name: 'CHamoru', nativeName: 'CHamoru' },
  { code: 'na', name: 'Nauruan', nativeName: 'Nauruan' },
  { code: 'to', name: 'Tongan', nativeName: 'Lea fakatonga' },
  { code: 'bi', name: 'Bislama', nativeName: 'Bislama' },
  { code: 'gil', name: 'Kiribati / Gilbertese', nativeName: 'Kiribati' },
  { code: 'mh', name: 'Marshallese', nativeName: 'Marshallese' },
] as const;
export type Locale = typeof LOCALES[number]['code'];
export type Messages = Record<string, string>;
export type Translation = { text: string; translated: boolean };
export const LANGUAGE_STORAGE_KEY = 'oy27-language';
export const SITE_PATHS = ['/', '/location', '/schedule', '/regulations', '/players', '/news', '/registration', '/organizer', '/federation-support', '/sponsors', '/contact-us', '/venue', '/map', '/dgt-boards'];

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && LOCALES.some(locale => locale.code === value);
}
export function preferredLocale(languages: readonly string[]): Locale {
  for (const language of languages) {
    const code = language.toLowerCase().split(/[-_]/)[0];
    if (isLocale(code)) return code;
  }
  return 'en';
}
export function stripLocalePath(path: string) {
  const match = path.match(/^\/([^/?#]+)(?=\/|[?#]|$)/);
  if (!match || !isLocale(match[1])) return path;
  const remaining = path.slice(match[0].length);
  return remaining.startsWith('/') ? remaining : '/' + remaining;
}
export function localizedHref(locale: Locale, href: string): string {
  if (!href.startsWith('/') || href.startsWith('//')) return href;
  const source = stripLocalePath(href);
  const [pathname] = source.split(/[?#]/);
  const plain = pathname.replace(/\/$/, '') || '/';
  if (!SITE_PATHS.includes(plain) && !plain.startsWith('/news/')) return href;
  return locale === 'en' ? source : `/${locale}${source}`;
}

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
export function createTranslator(locale: Locale, messages: Messages) {
  const translatedValues = new Set(Object.values(messages));
  const patterns = Object.entries(messages).filter(([key]) => /\{\w+\}/.test(key)).map(([key, value]) => {
    const names: string[] = [];
    const parts = key.split(/(\{\w+\})/).map(part => {
      if (/^\{\w+\}$/.test(part)) { names.push(part.slice(1, -1)); return '(.+?)'; }
      return escapeRegex(part);
    });
    return { regex: new RegExp('^' + parts.join('') + '$'), names, value };
  });
  return (source: string): Translation => {
    if (locale === 'en' || !/\p{L}/u.test(source)) return { text: source, translated: true };
    const key = source.trim().replace(/\s+/g, ' ');
    const leading = source.match(/^\s*/)?.[0] || '';
    const trailing = source.match(/\s*$/)?.[0] || '';
    if (messages[key]?.trim()) return { text: leading + messages[key] + trailing, translated: true };
    const date = key.match(/^(📅\s*)?(\d{1,2}) (January|February|March|April|May|June|July|August|September|October|November|December|Sept|Sep|Oct)(?: (\d{4}))?(\s*→)?$/);
    if (date && Intl.DateTimeFormat.supportedLocalesOf(locale).length) {
      const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
      const month = monthNames.findIndex(name => name.startsWith(date[3]));
      const formatted = new Intl.DateTimeFormat(locale, { day: 'numeric', month: date[3].length <= 4 ? 'short' : 'long', ...(date[4] ? { year: 'numeric' as const } : {}), timeZone: 'Australia/Melbourne' }).format(new Date(Date.UTC(Number(date[4] || 2027), month, Number(date[2]), 0)));
      return { text: leading + (date[1] || '') + formatted + (date[5] || '') + trailing, translated: true };
    }
    if (translatedValues.has(key)) return { text: source, translated: true };
    for (const pattern of patterns) {
      const match = key.match(pattern.regex);
      if (!match) continue;
      const values = Object.fromEntries(pattern.names.map((name, index) => [name, match[index + 1]]));
      return { text: leading + pattern.value.replace(/\{(\w+)\}/g, (token, name) => values[name] ?? token) + trailing, translated: true };
    }
    return { text: source, translated: false };
  };
}

export function translateHtml(html: string, translate: (source: string) => Translation) {
  // News HTML is generated from the site's own Markdown. Preserve markup/URLs,
  // translate text nodes only, and escape every replacement from the catalogue.
  return html.replace(/(^|>)([^<]+)(?=<|$)/g, (whole, prefix: string, source: string) => {
    if (!source.trim()) return whole;
    const result = translate(source);
    if (!result.translated) return `${prefix}<span lang="en">${source}</span>`;
    if (result.text === source) return whole;
    return prefix + result.text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  });
}
