import type {
  AllLeaguesResponseDto,
  LeagueDto,
} from '@/domains/leagues/api/leagues.dto';
import type { League } from '@/domains/leagues/models/league';
import { parseAlternateNames } from './alternateNamesMapper';

export function mapLeagueDtoToLeague(dto: LeagueDto): League | null {
  if (!dto.idLeague || !dto.strLeague) return null;

  return {
    id: dto.idLeague,
    name: dto.strLeague,
    sport: dto.strSport ?? '',
    alternateNames: parseAlternateNames(dto.strLeagueAlternate),
  };
}

export function mapAllLeaguesResponse(dto: AllLeaguesResponseDto): League[] {
  if (!dto.leagues) return [];

  return dto.leagues.reduce<League[]>((leagues, leagueDto) => {
    const league = mapLeagueDtoToLeague(leagueDto);
    if (league) leagues.push(league);
    return leagues;
  }, []);
}
