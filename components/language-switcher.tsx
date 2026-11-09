"use client";

import { useEffect, useId, useState } from 'react';
import { usePathname } from 'next/navigation';
import { LANGUAGE_STORAGE_KEY, LOCALES, isLocale, localizedHref, preferredLocale, type Locale } from '@/lib/i18n';
import { useI18n } from './i18n-provider';
import styles from './language-switcher.module.css';

function switchLanguage(locale: Locale, pathname: string) {
  try { localStorage.setItem(LANGUAGE_STORAGE_KEY, locale); } catch { /* Current-page selection still works. */ }
  window.location.assign(localizedHref(locale, pathname + window.location.search + window.location.hash));
}

export function LanguageSwitcher() {
  const { locale, coverage } = useI18n();
  const pathname = usePathname();
  const id = useId();
  return <div className={styles.control} translate="no" lang="en">
    <label className={styles.label} htmlFor={id}>Website language</label>
    <select className={styles.select} id={id} value={locale} onChange={event => { if (isLocale(event.target.value)) switchLanguage(event.target.value, pathname); }} aria-label="Website language">
      {LOCALES.map(entry => <option key={entry.code} value={entry.code} lang={entry.code}>{entry.nativeName}{entry.code === 'en' ? '' : coverage[entry.code] ? ' · Draft' : ' · Review template'}</option>)}
    </select>
  </div>;
}

export function TranslationNotice() {
  const { locale, messages } = useI18n();
  const pathname = usePathname();
  if (locale === 'en') return null;
  const name = LOCALES.find(entry => entry.code === locale)!.name;
  const count = Object.keys(messages).length;
  return <aside className={styles.notice} aria-label="Translation review status" translate="no" lang="en">
    <p><strong>{name} · {count ? 'Draft translation for federation review' : 'Translation review template'}</strong> — {count ? `${count} draft entries. Coverage is partial; untranslated text is shown in English.` : 'No reliable draft text is available yet. This page uses English while federation translations are prepared.'} These translations are not federation-approved. <a href={`/translations/review/${locale}.csv`} download>Download review sheet</a>.</p>
    <p>Official PDF documents and external registration services remain in their original language. <a href={localizedHref('en', pathname)}>Read in English</a>.</p>
  </aside>;
}

export function LanguageSuggestion() {
  const { locale } = useI18n();
  const pathname = usePathname();
  const [suggested, setSuggested] = useState<Locale>();
  useEffect(() => {
    let saved: string | null = null;
    try { saved = localStorage.getItem(LANGUAGE_STORAGE_KEY); } catch { /* Browser preferences remain usable. */ }
    const preferred = isLocale(saved) ? saved : preferredLocale(navigator.languages || [navigator.language]);
    setSuggested(preferred !== locale ? preferred : undefined);
  }, [locale]);
  if (!suggested) return null;
  const name = LOCALES.find(entry => entry.code === suggested)!.nativeName;
  return <div className={styles.suggestion} lang="en" translate="no"><span>Preferred language: {name}</span><button type="button" onClick={() => switchLanguage(suggested, pathname)}>Switch language</button><button type="button" aria-label="Dismiss language suggestion" onClick={() => setSuggested(undefined)}>×</button></div>;
}
