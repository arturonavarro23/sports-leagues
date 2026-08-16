export interface LeagueDto {
  idLeague: string | null;
  strLeague: string | null;
  strSport: string | null;
  strLeagueAlternate?: string | null;
}

export interface AllLeaguesResponseDto {
  leagues: LeagueDto[] | null;
}

export interface SeasonDto {
  strSeason: string | null;
  strBadge?: string | null;
}

export interface AllSeasonsResponseDto {
  seasons: SeasonDto[] | null;
}

export interface LeagueDetailDto {
  idLeague: string | null;
  strLeague: string | null;
  strSport: string | null;
  strLeagueAlternate?: string | null;
  strCurrentSeason?: string | null;
  intFormedYear?: string | null;
}

export interface LookupLeagueResponseDto {
  leagues: LeagueDetailDto[] | null;
}
