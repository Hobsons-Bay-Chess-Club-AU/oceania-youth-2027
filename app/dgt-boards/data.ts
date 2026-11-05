import { parseTournamentConfig } from "@/lib/lichess-broadcast";

export const broadcastConfig = parseTournamentConfig(process.env.NEXT_PUBLIC_LICHESS_TOURNAMENTS);
