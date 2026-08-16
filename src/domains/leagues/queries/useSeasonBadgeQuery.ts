import { useQuery } from '@tanstack/react-query';
import {
  QUERY_CACHE_DURATIONS,
  QUERY_KEYS,
  QUERY_RETRY,
} from '@/domains/leagues/constants/queryKeys';
import { fetchSeasonBadges } from '@/domains/leagues/api/leaguesRepository';
import { mapFirstAvailableBadge } from '@/domains/leagues/mappers/seasonBadgeMapper';
import type { SeasonBadge } from '@/domains/leagues/models/league';

export function useSeasonBadgeQuery(leagueId: string | null) {
  return useQuery<SeasonBadge | null>({
    queryKey: QUERY_KEYS.seasonBadge(leagueId ?? ''),
    queryFn: async ({ signal }) => {
      if (!leagueId) return null;
      const response = await fetchSeasonBadges(leagueId, signal);
      return mapFirstAvailableBadge(response);
    },
    enabled: Boolean(leagueId),
    staleTime: (query) =>
      query.state.data
        ? QUERY_CACHE_DURATIONS.seasonBadgeStaleTimeMs
        : QUERY_CACHE_DURATIONS.seasonBadgeEmptyStaleTimeMs,
    gcTime: QUERY_CACHE_DURATIONS.seasonBadgeGcTimeMs,
    retry: QUERY_RETRY.count,
    retryDelay: (attemptIndex) => QUERY_RETRY.baseDelayMs * 2 ** attemptIndex,
  });
}
