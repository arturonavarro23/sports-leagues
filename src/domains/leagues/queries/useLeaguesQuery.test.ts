import { HttpResponse, http } from 'msw';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { env } from '@/shared/config/env';
import { server } from '@/mocks/server';
import { createQueryWrapper } from '@/shared/test/renderWithProviders';
import { LEAGUES_API_PATHS } from '@/domains/leagues/constants/api';
import { errorHandlers } from '@/mocks/handlers';
import { useLeaguesQuery } from './useLeaguesQuery';

const allLeaguesUrl = `${env.apiBaseUrl}${LEAGUES_API_PATHS.allLeagues}`;

describe('useLeaguesQuery', () => {
  it('returns mapped domain League objects', async () => {
    const { result } = renderHook(() => useLeaguesQuery(), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.length).toBeGreaterThan(0);
    expect(result.current.data?.[0]).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: expect.any(String),
        sport: expect.any(String),
        alternateNames: expect.any(Array),
      }),
    );
  });

  it('surfaces an error state on a 500 response', async () => {
    server.use(errorHandlers.leaguesServerError);

    const { result } = renderHook(() => useLeaguesQuery(), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it('returns an empty array when leagues is null', async () => {
    server.use(errorHandlers.leaguesEmpty);

    const { result } = renderHook(() => useLeaguesQuery(), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([]);
  });

  it('requests the all-leagues endpoint', async () => {
    let requested = false;
    server.use(
      http.get(allLeaguesUrl, () => {
        requested = true;
        return HttpResponse.json({ leagues: [] });
      }),
    );

    const { result } = renderHook(() => useLeaguesQuery(), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(requested).toBe(true);
  });
});
