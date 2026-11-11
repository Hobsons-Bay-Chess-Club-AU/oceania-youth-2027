import sample from '@/public/tournament/sample-results.json';
import { validateTournamentResults, type TournamentResults } from '@/lib/tournament-results';

export const tournamentResults = sample as unknown as TournamentResults;
const errors = validateTournamentResults(tournamentResults);
if (errors.length) throw new Error(`Invalid tournament results JSON:\n${errors.join('\n')}`);
