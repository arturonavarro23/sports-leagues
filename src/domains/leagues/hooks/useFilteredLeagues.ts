import { useMemo } from 'react';
import type { League } from '../models/league';
import { filterLeagues, type LeagueFilters } from '../utils/leagueFilters';

export function useFilteredLeagues(
  leagues: League[],
  { search, sport }: LeagueFilters,
): League[] {
  return useMemo(
    () => filterLeagues(leagues, { search, sport }),
    [leagues, search, sport],
  );
}
