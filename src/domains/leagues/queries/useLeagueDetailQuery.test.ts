import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { server } from '@/mocks/server';
import { createQueryWrapper } from '@/shared/test/renderWithProviders';
import { errorHandlers } from '@/mocks/handlers';
import { useLeagueDetailQuery } from './useLeagueDetailQuery';

describe('useLeagueDetailQuery', () => {
  it('fires no request while leagueId is null', async () => {
    const requestListener = vi.fn();
    server.events.on('request:start', requestListener);

    const { result } = renderHook(() => useLeagueDetailQuery(null), {
      wrapper: createQueryWrapper(),
    });

    expect(result.current.fetchStatus).toBe('idle');
    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(requestListener).not.toHaveBeenCalled();
    server.events.removeListener('request:start', requestListener);
  });

  it('returns detail with parsed alternate names', async () => {
    const { result } = renderHook(() => useLeagueDetailQuery('4328'), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual({
      id: '4328',
      alternateNames: ['Premier League', 'EPL', 'England'],
      currentSeason: '2025-2026',
      formedYear: '1992',
    });
  });

  it('returns null when strLeagueAlternate is null', async () => {
    const { result } = renderHook(() => useLeagueDetailQuery('4436'), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.alternateNames).toEqual([]);
  });

  it('surfaces an error state on a 500 response', async () => {
    server.use(errorHandlers.leagueDetailServerError);

    const { result } = renderHook(() => useLeagueDetailQuery('4328'), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it('does not refetch on repeated selection of the same league', async () => {
    let requestCount = 0;
    server.events.on('request:start', ({ request }) => {
      if (request.url.includes('lookupleague')) requestCount += 1;
    });

    const { result, rerender } = renderHook(
      ({ leagueId }: { leagueId: string | null }) =>
        useLeagueDetailQuery(leagueId),
      {
        wrapper: createQueryWrapper(),
        initialProps: { leagueId: '4328' },
      },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(requestCount).toBe(1);

    rerender({ leagueId: '4328' });
    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(requestCount).toBe(1);
  });
});
