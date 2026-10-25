export type PlayerCategory = "Open" | "Girls";

export interface Player {
  name: string;
  division: string;
  category: PlayerCategory;
  federation: string;
  flag: string;
  fideId: string;
  fideRating: number;
  rapidRating?: number;
  blitzRating?: number;
  yob?: number;
  dob?: string;
}

export interface PlayersData {
  lastUpdated?: string;
  description?: string;
  divisions: string[];
  categories: PlayerCategory[];
  players: Player[];
}
