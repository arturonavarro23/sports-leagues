export interface League {
  id: string;
  name: string;
  sport: string;
  alternateNames: string[];
}

export interface LeagueDetail {
  id: string;
  alternateNames: string[];
  currentSeason: string | null;
  formedYear: string | null;
}

export interface SeasonBadge {
  season: string;
  badgeUrl: string;
}

export interface SportOption {
  value: string;
  label: string;
}
