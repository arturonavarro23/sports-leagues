import { useQuery } from '@tanstack/react-query';
import {
  QUERY_CACHE_DURATIONS,
  QUERY_KEYS,
  QUERY_RETRY,
} from '@/domains/leagues/constants/queryKeys';
import { fetchLeagueDetail } from '@/domains/leagues/api/leaguesRepository';
import { mapLookupLeagueResponse } from '@/domains/leagues/mappers/leagueDetailMapper';
import type { LeagueDetail } from '@/domains/leagues/models/league';

export function useLeagueDetailQuery(leagueId: string | null) {
  return useQuery<LeagueDetail | null>({
    queryKey: QUERY_KEYS.leagueDetail(leagueId ?? ''),
    queryFn: async ({ signal }) => {
      if (!leagueId) return null;
      const response = await fetchLeagueDetail(leagueId, signal);
      return mapLookupLeagueResponse(response, leagueId);
    },
    enabled: Boolean(leagueId),
    staleTime: QUERY_CACHE_DURATIONS.leagueDetailStaleTimeMs,
    gcTime: QUERY_CACHE_DURATIONS.leagueDetailGcTimeMs,
    retry: QUERY_RETRY.count,
    retryDelay: (attemptIndex) => QUERY_RETRY.baseDelayMs * 2 ** attemptIndex,
  });
}
