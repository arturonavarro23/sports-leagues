export const LEAGUES_API_PATHS = {
  allLeagues: '/all_leagues.php',
  allSeasons: '/search_all_seasons.php',
  leagueDetail: '/lookupleague.php',
} as const;

export const SEASON_BADGE_QUERY_PARAMS = {
  badge: 'badge',
  leagueId: 'id',
} as const;

export const LEAGUE_DETAIL_QUERY_PARAMS = {
  leagueId: 'id',
} as const;
