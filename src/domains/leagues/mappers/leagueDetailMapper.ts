import type { LookupLeagueResponseDto } from '@/domains/leagues/api/leagues.dto';
import type { LeagueDetail } from '@/domains/leagues/models/league';
import { parseAlternateNames } from './alternateNamesMapper';

export function mapLookupLeagueResponse(
  dto: LookupLeagueResponseDto,
  leagueId: string,
): LeagueDetail | null {
  if (!dto.leagues || dto.leagues.length === 0) return null;

  const entry = dto.leagues.find((league) => league.idLeague === leagueId);

  if (!entry || !entry.idLeague || !entry.strLeague) return null;

  return {
    id: entry.idLeague,
    alternateNames: parseAlternateNames(entry.strLeagueAlternate),
    currentSeason: entry.strCurrentSeason ?? null,
    formedYear: entry.intFormedYear ?? null,
  };
}
