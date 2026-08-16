import { QueryClient } from '@tanstack/react-query';
import { QUERY_RETRY } from '@/domains/leagues/constants/queryKeys';

export function createAppQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: QUERY_RETRY.count,
        retryDelay: (attemptIndex) =>
          QUERY_RETRY.baseDelayMs * 2 ** attemptIndex,
      },
    },
  });
}

export const appQueryClient = createAppQueryClient();
