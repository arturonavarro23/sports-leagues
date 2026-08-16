import type {
  AllLeaguesResponseDto,
  LeagueDetailDto,
  LeagueDto,
  SeasonDto,
} from '@/domains/leagues/api/leagues.dto';

// The live free tier returns five Soccer leagues without strLeagueAlternate;
// this dataset keeps sport filtering and alternate names exercisable.
export const LEAGUE_DTO_FIXTURES: LeagueDto[] = [
  {
    idLeague: '4328',
    strLeague: 'English Premier League',
    strSport: 'Soccer',
    strLeagueAlternate: 'Premier League, EPL',
  },
  {
    idLeague: '4329',
    strLeague: 'English League Championship',
    strSport: 'Soccer',
    strLeagueAlternate: 'Championship, EFL Championship',
  },
  {
    idLeague: '4330',
    strLeague: 'Scottish Premier League',
    strSport: 'Soccer',
    strLeagueAlternate: 'Scottish Premiership',
  },
  {
    idLeague: '4331',
    strLeague: 'German Bundesliga',
    strSport: 'Soccer',
    strLeagueAlternate: 'Bundesliga',
  },
  {
    idLeague: '4332',
    strLeague: 'Italian Serie A',
    strSport: 'Soccer',
    strLeagueAlternate: 'Serie A',
  },
  {
    idLeague: '4387',
    strLeague: 'NBA',
    strSport: 'Basketball',
    strLeagueAlternate: 'National Basketball Association',
  },
  {
    idLeague: '4436',
    strLeague: 'Spanish Liga ACB',
    strSport: 'Basketball',
    strLeagueAlternate: null,
  },
  {
    idLeague: '4391',
    strLeague: 'NFL',
    strSport: 'American Football',
    strLeagueAlternate: 'National Football League',
  },
  {
    idLeague: '4424',
    strLeague: 'MLB',
    strSport: 'Baseball',
    strLeagueAlternate: 'Major League Baseball',
  },
  {
    idLeague: '4380',
    strLeague: 'NHL',
    strSport: 'Ice Hockey',
    strLeagueAlternate: 'National Hockey League',
  },
  {
    idLeague: '4370',
    strLeague: 'Formula 1',
    strSport: 'Motorsport',
    strLeagueAlternate: 'F1, FIA Formula One World Championship',
  },
  {
    idLeague: '4464',
    strLeague: 'MotoGP',
    strSport: 'Motorsport',
    strLeagueAlternate: 'Grand Prix motorcycle racing',
  },
  {
    idLeague: '4517',
    strLeague:
      'International Championship of Extraordinarily Long League Names and Associated Competitions',
    strSport: 'Rugby',
    strLeagueAlternate:
      'The Extraordinarily Long Alternate Name Used To Verify Text Wrapping Behaviour',
  },
];

export const ALL_LEAGUES_RESPONSE_FIXTURE: AllLeaguesResponseDto = {
  leagues: LEAGUE_DTO_FIXTURES,
};

const BADGE_ARCHIVE =
  'https://r2.thesportsdb.com/images/media/league/badgearchive';

// Every URL here was read from the live API rather than written by hand.
export const SEASON_BADGES_BY_LEAGUE_ID: Record<string, SeasonDto[]> = {
  // A badge-less first season proves the mapper picks the first AVAILABLE one.
  '4328': [
    { strSeason: '1991-1992', strBadge: null },
    {
      strSeason: '1992-1993',
      strBadge: `${BADGE_ARCHIVE}/02egea1661959225.png`,
    },
  ],
  '4329': [{ strSeason: '2023-2024', strBadge: null }],
  '4330': [
    {
      strSeason: '2012-2013',
      strBadge: `${BADGE_ARCHIVE}/85rak91688422035.png`,
    },
  ],
  '4331': [
    {
      strSeason: '2006-2007',
      strBadge: `${BADGE_ARCHIVE}/c5u0dp1661980756.png`,
    },
  ],
  '4332': [
    {
      strSeason: '2004-2005',
      strBadge: `${BADGE_ARCHIVE}/eth93f1676667556.png`,
    },
  ],
  '4387': [
    {
      strSeason: '1960-1961',
      strBadge: `${BADGE_ARCHIVE}/2bidww1717672542.png`,
    },
  ],
  '4391': [
    { strSeason: '1960', strBadge: `${BADGE_ARCHIVE}/ca9l9q1719578565.png` },
  ],
  '4424': [
    { strSeason: '1976', strBadge: `${BADGE_ARCHIVE}/optfoi1708103503.png` },
  ],
  '4380': [
    {
      strSeason: '1958-1959',
      strBadge: `${BADGE_ARCHIVE}/8qey981713982448.png`,
    },
  ],
  '4370': [
    { strSeason: '1950', strBadge: `${BADGE_ARCHIVE}/afrdnu1749137860.png` },
  ],
  '4464': [
    { strSeason: '1972', strBadge: `${BADGE_ARCHIVE}/nl301y1674668833.png` },
  ],
};

export const LEAGUE_DETAIL_DTOS_BY_ID: Record<string, LeagueDetailDto> = {
  '4328': {
    idLeague: '4328',
    strLeague: 'English Premier League',
    strSport: 'Soccer',
    strLeagueAlternate: 'Premier League, EPL, England',
    strCurrentSeason: '2025-2026',
    intFormedYear: '1992',
  },
  '4387': {
    idLeague: '4387',
    strLeague: 'NBA',
    strSport: 'Basketball',
    strLeagueAlternate: 'National Basketball Association',
    strCurrentSeason: '2025-2026',
    intFormedYear: '1946',
  },
  '4436': {
    idLeague: '4436',
    strLeague: 'Spanish Liga ACB',
    strSport: 'Basketball',
    strLeagueAlternate: null,
    strCurrentSeason: '2025-2026',
    intFormedYear: '1983',
  },
};

// One league per unhappy path, so the demo shows badges by default and each
// fallback stays reachable. 4329 genuinely has no badge in the live API.
export const LEAGUE_ID_WITHOUT_BADGE = '4329';
export const LEAGUE_ID_WITH_BADGE_ERROR = '4436';
export const LEAGUE_ID_WITH_EMPTY_SEASONS = '4517';
