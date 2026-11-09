import type { Metadata } from 'next';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { LOCALES, SITE_PATHS, isLocale, localizedHref, createTranslator } from '@/lib/i18n';
import { getMessages } from '@/lib/i18n-catalogs';
import { getAllNewsPostSummaries, getNewsPostBySlug } from '@/lib/news';
import { siteConfig } from '@/lib/site-config';
import { HomePage } from '@/components/pages/home-page';
import { LocationPage } from '@/components/pages/location-page';
import { SchedulePage } from '@/components/pages/schedule-page';
import { RegulationsPage } from '@/components/pages/regulations-page';
import { PlayersPage } from '@/components/pages/players-page';
import { NewsPage } from '@/components/pages/news-page';
import { NewsPostPage } from '@/components/pages/news-post-page';
import { RegistrationPage } from '@/components/pages/registration-page';
import { OrganizerPage } from '@/components/pages/organizer-page';
import { FederationSupportPage } from '@/components/pages/federation-support-page';
import { SponsorsPage } from '@/components/pages/sponsors-page';
import { ContactUsPage } from '@/components/pages/contact-us-page';
import { VenuePage } from '@/components/pages/venue-page';
import { MapPage } from '@/components/pages/map-page';
import { DgtBoardsPage } from '@/components/pages/dgt-boards-page';
import { buildFederationLookup } from '@/lib/broadcast-piece-sets';
import { fetchBroadcastNames } from '@/lib/lichess-broadcast';
import { broadcastConfig } from '@/app/dgt-boards/data';
import players from '@/public/players.json';

export const dynamic = 'force-static';
export const dynamicParams = false;
const pages = { '/': HomePage, '/location': LocationPage, '/schedule': SchedulePage, '/regulations': RegulationsPage,
  '/players': PlayersPage, '/news': NewsPage, '/registration': RegistrationPage, '/organizer': OrganizerPage,
  '/federation-support': FederationSupportPage, '/sponsors': SponsorsPage, '/contact-us': ContactUsPage,
  '/venue': VenuePage, '/map': MapPage };
const titles: Record<string, string> = { '/': 'Oceania Youth 2027', '/location': 'Location', '/schedule': 'Tournament Schedule', '/regulations': 'Official Tournament Regulations', '/players': 'Player Directory', '/news': 'News & Updates', '/registration': 'Registration', '/organizer': 'Organizer', '/federation-support': 'Federation Support', '/sponsors': 'Sponsors', '/contact-us': 'Contact Us', '/venue': 'Venue', '/map': 'Map', '/dgt-boards': 'Broadcast room' };
type Params = { locale: string; path?: string[] };

export function generateStaticParams() {
  const paths = [...SITE_PATHS, ...getAllNewsPostSummaries().map(post => `/news/${post.slug}`)];
  return LOCALES.filter(locale => locale.code !== 'en').flatMap(locale => paths.map(path => ({ locale: locale.code, path: path.split('/').filter(Boolean) })));
}
export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale, path = [] } = await params;
  if (!isLocale(locale)) return {};
  const sourcePath = '/' + path.join('/');
  const t = createTranslator(locale, getMessages(locale));
  return { title: t(titles[sourcePath] || getNewsPostBySlug(path[1] || '')?.title || siteConfig.name).text,
    description: t(siteConfig.description).text,
    alternates: { canonical: localizedHref(locale, sourcePath + (sourcePath.endsWith('/') ? '' : '/')), languages: Object.fromEntries([...LOCALES.map(entry => [entry.code, localizedHref(entry.code, sourcePath + (sourcePath.endsWith('/') ? '' : '/'))]), ['x-default', sourcePath]]) },
    robots: { index: false, follow: true },
    openGraph: { title: t(titles[sourcePath] || siteConfig.name).text, locale: locale.replace('-', '_'), siteName: siteConfig.name, type: 'website' },
  };
}
export default async function Page({ params }: { params: Promise<Params> }) {
  const { locale, path = [] } = await params;
  if (!isLocale(locale) || locale === 'en') notFound();
  const sourcePath = '/' + path.join('/');
  if (path[0] === 'news' && path.length === 2) {
    if (!getNewsPostBySlug(path[1])) notFound();
    return <NewsPostPage slug={path[1]} />;
  }
  if (sourcePath === '/dgt-boards') {
    const initialNames = await fetchBroadcastNames(broadcastConfig.tournaments, { token: process.env.NEXT_PUBLIC_LICHESS_TOKEN });
    return <DgtBoardsPage initialNames={initialNames} federationLookup={buildFederationLookup(players.players)} />;
  }
  const Component = pages[sourcePath as keyof typeof pages];
  if (!Component) notFound();
  return <Suspense fallback={<p lang="en" role="status">Loading page…</p>}><Component /></Suspense>;
}
