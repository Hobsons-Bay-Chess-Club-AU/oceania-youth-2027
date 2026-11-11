export type TournamentPlayer = {
  id: string; name: string; title?: string; seed: number;
  federation: { code: string; flag: string; name: string };
  ratings: Record<string, number>;
};
export type GameResult = '1-0' | '0-1' | '1/2-1/2' | '1-0F' | '0-1F' | 'bye' | null;
export type TournamentPairing = {
  id: string; board: number | null; whiteId: string; blackId: string | null;
  status: 'scheduled' | 'playing' | 'completed'; result: GameResult;
  whitePointsBefore: number | null; blackPointsBefore: number | null; byePoints?: number;
};
export type TournamentRound = { number: number; startsAt: string; status: 'scheduled' | 'live' | 'completed'; pairings: TournamentPairing[] };
export type StandingRow = {
  rank: number; playerId: string; points: number; played: number; wins: number; draws: number; losses: number; byes: number;
  tieBreaks: { buchholz: number; sonnebornBerger: number };
  form: { round: number; result: 'W' | 'D' | 'L' | 'B' }[];
};
export type StandingSnapshot = { afterRound: number; provisional: boolean; rows: StandingRow[] };
export type DivisionCompetition = { formatId: string; updatedAt?: string; rounds: TournamentRound[]; standings: StandingSnapshot[] };
export type TournamentDivision = { id: string; name: string; ageGroup: string; category: 'Open' | 'Girls'; players: TournamentPlayer[]; competitions: DivisionCompetition[] };
export type TournamentResults = {
  schemaVersion: 1; isSample: boolean; eventName: string; updatedAt: string; timeZone: string;
  tieBreakDescription: string;
  formats: { id: string; name: string; timeControl: string; totalRounds: number }[];
  divisions: TournamentDivision[];
};

export function formatPoints(points: number): string {
  return Number.isInteger(points) ? String(points) : points % 1 === .5 ? `${Math.floor(points) || ''}½` : String(points);
}
export function resultLabel(pairing: TournamentPairing): string {
  if (pairing.result === 'bye') return `Bye · ${formatPoints(pairing.byePoints ?? 1)}`;
  if (pairing.result === '1/2-1/2') return '½–½';
  if (pairing.result === '1-0F') return '1–0 F';
  if (pairing.result === '0-1F') return '0–1 F';
  if (pairing.result) return pairing.result.replace('-', '–');
  return pairing.status === 'playing' ? 'In progress' : '—';
}
export function defaultRound(competition: DivisionCompetition): number {
  const live = competition.rounds.find(round => round.status === 'live');
  const completed = competition.rounds.filter(round => round.status === 'completed');
  return live?.number ?? completed.at(-1)?.number ?? competition.rounds[0]?.number ?? 1;
}
export function latestSnapshot(competition: DivisionCompetition): StandingSnapshot | undefined {
  return competition.standings.reduce<StandingSnapshot | undefined>((latest, snapshot) => !latest || snapshot.afterRound > latest.afterRound ? snapshot : latest, undefined);
}
export function validateTournamentResults(data: TournamentResults): string[] {
  const errors: string[] = [];
  const formatIds = new Set(data.formats.map(format => format.id));
  if (formatIds.size !== data.formats.length) errors.push('Duplicate format IDs');
  const divisionIds = new Set<string>();
  for (const division of data.divisions) {
    if (divisionIds.has(division.id)) errors.push(`Duplicate division: ${division.id}`);
    divisionIds.add(division.id);
    const players = new Set(division.players.map(player => player.id));
    if (players.size !== division.players.length) errors.push(`Duplicate player IDs: ${division.id}`);
    for (const competition of division.competitions) {
      if (!formatIds.has(competition.formatId)) errors.push(`Unknown format: ${competition.formatId}`);
      const rounds = new Set<number>();
      for (const round of competition.rounds) {
        if (rounds.has(round.number)) errors.push(`Duplicate round: ${division.id}/${round.number}`);
        rounds.add(round.number);
        const participants = new Set<string>();
        const boards = new Set<number>();
        for (const pairing of round.pairings) {
          for (const id of [pairing.whiteId, pairing.blackId].filter((id): id is string => id !== null)) {
            if (!players.has(id)) errors.push(`Unknown player: ${id}`);
            if (participants.has(id)) errors.push(`Player paired twice: ${id}, round ${round.number}`);
            participants.add(id);
          }
          if (pairing.board !== null) {
            if (boards.has(pairing.board)) errors.push(`Duplicate board: ${division.id}/${round.number}/${pairing.board}`);
            boards.add(pairing.board);
          }
          if ((pairing.result === 'bye') !== (pairing.blackId === null)) errors.push(`Invalid bye: ${pairing.id}`);
          if ((pairing.status === 'completed') !== (pairing.result !== null)) errors.push(`Result/status mismatch: ${pairing.id}`);
        }
      }
      for (const snapshot of competition.standings) {
        const ranked = new Set<string>();
        if (!rounds.has(snapshot.afterRound)) errors.push(`Unknown snapshot round: ${division.id}/${snapshot.afterRound}`);
        for (const row of snapshot.rows) {
          if (!players.has(row.playerId)) errors.push(`Unknown standing player: ${row.playerId}`);
          if (ranked.has(row.playerId)) errors.push(`Duplicate standing player: ${row.playerId}`);
          ranked.add(row.playerId);
          if (row.points < 0 || row.points > snapshot.afterRound) errors.push(`Invalid points: ${row.playerId}`);
          if (row.played !== row.wins + row.draws + row.losses + row.byes) errors.push(`Played count mismatch: ${row.playerId}`);
        }
      }
    }
  }
  return errors;
}
