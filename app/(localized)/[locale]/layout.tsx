import { notFound } from 'next/navigation';
import { SiteDocument, englishMetadata } from '@/components/site-document';
import { isLocale } from '@/lib/i18n';

export const metadata = { ...englishMetadata, alternates: undefined, robots: { index: false, follow: true } };

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale) || locale === 'en') notFound();
  return <SiteDocument locale={locale}>{children}</SiteDocument>;
}
