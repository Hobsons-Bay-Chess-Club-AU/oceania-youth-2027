import { Children, cloneElement, createElement, isValidElement, type ReactElement, type ReactNode } from 'react';
import type { Locale, Translation } from './i18n';

const textProps = new Set(['title', 'description', 'eyebrow', 'label', 'placeholder', 'alt', 'aria-label', 'aria-description']);
const textOnlyTags = new Set(['option', 'textarea', 'title', 'text', 'tspan', 'script', 'style']);

export function localizeReactTree(children: ReactNode, { locale, translate, href, html, boundary }: {
  locale: Locale; translate: (source: string) => Translation;
  href: (source: string) => string; html: (source: string) => string; boundary?: unknown;
}): ReactNode {
  if (locale === 'en') return children;
  function visit(node: ReactNode, textOnly = false, parentLanguage: string = locale): ReactNode {
    if (typeof node === 'string') {
      const result = translate(node);
      if (result.translated) {
        return parentLanguage === 'en' && !textOnly && /\p{L}/u.test(result.text)
          ? createElement('span', { lang: locale }, result.text) : result.text;
      }
      return textOnly ? result.text : createElement('span', { lang: 'en', 'data-translation-fallback': 'true' }, node);
    }
    if (!isValidElement(node) || node.type === boundary) return node;
    const element = node as ReactElement<Record<string, unknown>>;
    const props = element.props;
    if (props.translate === 'no' || props['data-no-translate'] || element.type === 'script' || element.type === 'style') return node;
    const changes: Record<string, unknown> = {};
    let englishAttribute = false;
    for (const key of textProps) if (typeof props[key] === 'string') {
      const result = translate(props[key] as string);
      changes[key] = result.text;
      if (['aria-label', 'aria-description', 'alt', 'placeholder', 'title'].includes(key) && !result.translated) englishAttribute = true;
    }
    const ownLanguage = englishAttribute ? 'en' : typeof props.lang === 'string' ? props.lang : locale;
    if (englishAttribute || parentLanguage !== locale) changes.lang = ownLanguage;
    if (typeof props.href === 'string') changes.href = href(props.href);
    const onlyText = textOnly || (typeof element.type === 'string' && textOnlyTags.has(element.type));
    if (props.children !== undefined) {
      changes.children = Children.map(props.children as ReactNode, child => visit(child, onlyText, ownLanguage));
      if (onlyText && typeof props.children === 'string' && !translate(props.children).translated) changes.lang = 'en';
    }
    if (props.dangerouslySetInnerHTML && typeof (props.dangerouslySetInnerHTML as { __html?: unknown }).__html === 'string') {
      changes.dangerouslySetInnerHTML = { __html: html((props.dangerouslySetInnerHTML as { __html: string }).__html) };
    }
    return cloneElement(element, changes);
  }
  return Children.map(children, child => visit(child));
}
