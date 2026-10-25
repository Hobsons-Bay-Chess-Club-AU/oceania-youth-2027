import { PlayersData } from "./types";

export * from "./types";

export const DEFAULT_DIVISIONS = ["U8", "U10", "U12", "U14", "U16", "U18", "U20"];
export const DEFAULT_CATEGORIES = ["Open", "Girls"] as const;

export const fallbackPlayersData: PlayersData = {
  description:
    "Browse players by division, search by name or FIDE ID, and filter by category or federation.",
  divisions: DEFAULT_DIVISIONS,
  categories: ["Open", "Girls"],
  players: [],
};

// Kept for backward compatibility if imported elsewhere
export const playersData = fallbackPlayersData;
