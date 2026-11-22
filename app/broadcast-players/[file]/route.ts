import { broadcastConfig } from '@/app/dgt-boards/data';
import { fetchBroadcastPlayerRoster } from '@/lib/broadcast-players';

export const dynamic = 'force-static';

export function generateStaticParams() {
  return broadcastConfig.tournaments.map(tournament => ({ file: `${tournament.id}.json` }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const id = file.replace(/\.json$/, '');
  if (!file.endsWith('.json') || !/^[A-Za-z0-9]{8}$/.test(id)) return Response.json({ unavailable: true }, { status: 404 });
  try {
    return Response.json(await fetchBroadcastPlayerRoster(id));
  } catch {
    console.warn(`Could not export broadcast player roster for ${id}; existing federation fallbacks remain available.`);
    // Distinguish an unavailable upstream roster from a genuinely empty list so
    // browsers can retain any previously cached roster on a failed build fetch.
    return Response.json({ unavailable: true });
  }
}
