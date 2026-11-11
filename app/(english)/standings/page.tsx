import type { Metadata } from 'next';
import { TournamentReportPage } from '@/components/pages/tournament-report-page';
import { tournamentResults } from '@/lib/tournament-data';

export const metadata: Metadata = { title: 'Standings', alternates: { canonical: '/standings/' }, robots: { index: false, follow: true } };
export default function Page() { return <TournamentReportPage mode="standings" data={tournamentResults} />; }
