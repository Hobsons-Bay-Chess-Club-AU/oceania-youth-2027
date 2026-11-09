import { DgtBoardsPage } from "@/components/pages/dgt-boards-page";
import { broadcastConfig } from "@/app/dgt-boards/data";
import { fetchBroadcastNames } from "@/lib/lichess-broadcast";

import players from "@/public/players.json";
import { buildFederationLookup } from "@/lib/broadcast-piece-sets";

export const dynamic = "force-static";

export default async function Page() {
  const initialNames = await fetchBroadcastNames(broadcastConfig.tournaments, {
    token: process.env.NEXT_PUBLIC_LICHESS_TOKEN,
  });
  return <DgtBoardsPage initialNames={initialNames} federationLookup={buildFederationLookup(players.players)} />;
}
