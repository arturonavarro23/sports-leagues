import type { League } from '../models/league';
import { ALL_SPORTS_VALUE } from '../constants/filters';
import { normalizeText } from './normalizeText';

export interface LeagueFilters {
  search: string;
  sport: string;
}

export function matchesSearch(league: League, query: string): boolean {
  const normalizedQuery = normalizeText(query);
  if (!normalizedQuery) return true;

  const normalizedName = normalizeText(league.name);
  if (normalizedName.includes(normalizedQuery)) return true;

  return league.alternateNames.some((alternateName) =>
    normalizeText(alternateName).includes(normalizedQuery),
  );
}

export function matchesSport(league: League, sport: string): boolean {
  if (sport === ALL_SPORTS_VALUE) return true;
  return league.sport === sport;
}

export function filterLeagues(
  leagues: League[],
  { search, sport }: LeagueFilters,
): League[] {
  return leagues.filter(
    (league) => matchesSearch(league, search) && matchesSport(league, sport),
  );
}
