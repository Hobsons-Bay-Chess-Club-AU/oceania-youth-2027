import { DgtBoardsPage } from "@/components/pages/dgt-boards-page";
import { broadcastConfig } from "./data";
import { fetchBroadcastNames } from "@/lib/lichess-broadcast";

export const dynamic = "force-static";

export default async function Page() {
  const initialNames = await fetchBroadcastNames(broadcastConfig.tournaments, {
    token: process.env.NEXT_PUBLIC_LICHESS_TOKEN,
  });
  return <DgtBoardsPage initialNames={initialNames} />;
}
