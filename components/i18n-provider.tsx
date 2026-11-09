"use client";

import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { localizeReactTree } from '@/lib/localize-react';
import { createTranslator, localizedHref, translateHtml, type Locale, type Messages } from '@/lib/i18n';

const defaultTranslate = createTranslator('en', {});
const I18n = createContext({ locale: 'en' as Locale, messages: {} as Messages, coverage: {} as Record<string, number>, translate: defaultTranslate });

export function I18nProvider({ locale, messages, coverage, children }: { locale: Locale; messages: Messages; coverage: Record<string, number>; children: ReactNode }) {
  const value = useMemo(() => ({ locale, messages, coverage, translate: createTranslator(locale, messages) }), [locale, messages, coverage]);
  return <I18n.Provider value={value}>{children}</I18n.Provider>;
}
export const useI18n = () => useContext(I18n);

export function Translated({ children }: { children: ReactNode }) {
  const { locale, translate } = useI18n();
  return <>{localizeReactTree(children, { locale, translate, href: value => localizedHref(locale, value), html: value => translateHtml(value, translate), boundary: Translated })}</>;
}
