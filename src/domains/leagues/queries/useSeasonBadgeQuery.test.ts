import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { server } from '@/mocks/server';
import { createQueryWrapper } from '@/shared/test/renderWithProviders';
import { errorHandlers } from '@/mocks/handlers';
import {
  LEAGUE_ID_WITHOUT_BADGE,
  LEAGUE_ID_WITH_BADGE_ERROR,
  LEAGUE_ID_WITH_EMPTY_SEASONS,
} from '@/mocks/leagueFixtures';
import { useSeasonBadgeQuery } from './useSeasonBadgeQuery';

describe('useSeasonBadgeQuery', () => {
  it('fires no request while leagueId is null', async () => {
    const requestListener = vi.fn();
    server.events.on('request:start', requestListener);

    const { result } = renderHook(() => useSeasonBadgeQuery(null), {
      wrapper: createQueryWrapper(),
    });

    expect(result.current.fetchStatus).toBe('idle');
    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(requestListener).not.toHaveBeenCalled();
    server.events.removeListener('request:start', requestListener);
  });

  it('returns the first available badge', async () => {
    const { result } = renderHook(() => useSeasonBadgeQuery('4328'), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual({
      season: '1992-1993',
      badgeUrl:
        'https://r2.thesportsdb.com/images/media/league/badgearchive/02egea1661959225.png',
    });
  });

  it('returns null when the league has no badge', async () => {
    const { result } = renderHook(
      () => useSeasonBadgeQuery(LEAGUE_ID_WITHOUT_BADGE),
      { wrapper: createQueryWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeNull();
  });

  it('returns null when seasons is empty', async () => {
    const { result } = renderHook(
      () => useSeasonBadgeQuery(LEAGUE_ID_WITH_EMPTY_SEASONS),
      { wrapper: createQueryWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeNull();
  });

  it('surfaces an error state on a 500 response', async () => {
    server.use(errorHandlers.seasonBadgeServerError);

    const { result } = renderHook(
      () => useSeasonBadgeQuery(LEAGUE_ID_WITH_BADGE_ERROR),
      { wrapper: createQueryWrapper() },
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it('does not refetch on repeated selection of the same league', async () => {
    let requestCount = 0;
    server.events.on('request:start', ({ request }) => {
      if (request.url.includes('search_all_seasons')) requestCount += 1;
    });

    const { result, rerender } = renderHook(
      ({ leagueId }: { leagueId: string | null }) =>
        useSeasonBadgeQuery(leagueId),
      {
        wrapper: createQueryWrapper(),
        initialProps: { leagueId: '4328' as string | null },
      },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(requestCount).toBe(1);

    rerender({ leagueId: null });
    rerender({ leagueId: '4328' });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.badgeUrl).toBeTruthy();
    expect(requestCount).toBe(1);
  });
});
