import { describe, expect, it } from 'vitest';
import { QueryClient, type Query } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/domains/leagues/constants/queryKeys';
import { shouldPersistQuery } from './queryPersister';

function queryWithKey(queryKey: readonly unknown[]): Query {
  const client = new QueryClient();
  client.setQueryData(queryKey, null);
  const query = client.getQueryCache().find({ queryKey });
  if (!query) throw new Error('Query was not created');
  return query;
}

describe('shouldPersistQuery', () => {
  it('persists the leagues list', () => {
    expect(shouldPersistQuery(queryWithKey(QUERY_KEYS.leagues))).toBe(true);
  });

  it('persists league detail', () => {
    expect(
      shouldPersistQuery(queryWithKey(QUERY_KEYS.leagueDetail('4328'))),
    ).toBe(true);
  });

  it('does not persist season badges', () => {
    expect(
      shouldPersistQuery(queryWithKey(QUERY_KEYS.seasonBadge('4328'))),
    ).toBe(false);
  });
});
