import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { del, get, set } from 'idb-keyval';
import type { Query } from '@tanstack/react-query';
import { PERSISTED_CACHE } from '@/shared/constants/persistence';
import { QUERY_KEYS } from '@/domains/leagues/constants/queryKeys';

const PERSISTED_QUERY_KEYS: readonly string[] = [
  QUERY_KEYS.leagues[0],
  QUERY_KEYS.leagueDetail('')[0],
];

export function createIndexedDbPersister() {
  return createAsyncStoragePersister({
    key: PERSISTED_CACHE.storageKey,
    storage: {
      getItem: (key) => get(key),
      setItem: (key, value) => set(key, value),
      removeItem: (key) => del(key),
    },
  });
}

// Badges are cheap to refetch and numerous; persisting them would grow the
// stored payload without saving a request the user is likely to repeat.
export function shouldPersistQuery(query: Query): boolean {
  const root = query.queryKey[0];
  return typeof root === 'string' && PERSISTED_QUERY_KEYS.includes(root);
}
