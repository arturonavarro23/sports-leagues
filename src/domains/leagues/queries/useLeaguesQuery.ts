import { useQuery } from '@tanstack/react-query';
import {
  QUERY_CACHE_DURATIONS,
  QUERY_KEYS,
  QUERY_RETRY,
} from '@/domains/leagues/constants/queryKeys';
import { fetchAllLeagues } from '@/domains/leagues/api/leaguesRepository';
import { mapAllLeaguesResponse } from '@/domains/leagues/mappers/leagueMapper';
import type { League } from '@/domains/leagues/models/league';

export function useLeaguesQuery() {
  return useQuery<League[]>({
    queryKey: QUERY_KEYS.leagues,
    queryFn: async ({ signal }) => {
      const response = await fetchAllLeagues(signal);
      return mapAllLeaguesResponse(response);
    },
    staleTime: QUERY_CACHE_DURATIONS.leaguesStaleTimeMs,
    gcTime: QUERY_CACHE_DURATIONS.leaguesGcTimeMs,
    retry: QUERY_RETRY.count,
    retryDelay: (attemptIndex) => QUERY_RETRY.baseDelayMs * 2 ** attemptIndex,
  });
}
