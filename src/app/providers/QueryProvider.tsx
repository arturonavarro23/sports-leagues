import type { ReactNode } from 'react';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { appQueryClient } from '@/app/providers/queryClient';
import {
  createIndexedDbPersister,
  shouldPersistQuery,
} from '@/app/providers/queryPersister';
import {
  buildCacheBuster,
  PERSISTED_CACHE,
} from '@/shared/constants/persistence';
import { env } from '@/shared/config/env';

interface QueryProviderProps {
  children: ReactNode;
}

const persister = createIndexedDbPersister();

export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <PersistQueryClientProvider
      client={appQueryClient}
      persistOptions={{
        persister,
        maxAge: PERSISTED_CACHE.maxAgeMs,
        buster: buildCacheBuster(env.isMockApiEnabled),
        dehydrateOptions: { shouldDehydrateQuery: shouldPersistQuery },
      }}
    >
      {children}
    </PersistQueryClientProvider>
  );
}
