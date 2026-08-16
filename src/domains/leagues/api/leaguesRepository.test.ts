import { HttpResponse, http } from 'msw';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { env } from '@/shared/config/env';
import { server } from '@/mocks/server';
import { LEAGUES_API_PATHS } from '@/domains/leagues/constants/api';
import {
  ALL_LEAGUES_RESPONSE_FIXTURE,
  LEAGUE_DETAIL_DTOS_BY_ID,
  SEASON_BADGES_BY_LEAGUE_ID,
} from '@/mocks/leagueFixtures';
import { ApiError } from './apiError';
import {
  fetchAllLeagues,
  fetchLeagueDetail,
  fetchSeasonBadges,
} from './leaguesRepository';

const allLeaguesUrl = `${env.apiBaseUrl}${LEAGUES_API_PATHS.allLeagues}`;
const allSeasonsUrl = `${env.apiBaseUrl}${LEAGUES_API_PATHS.allSeasons}`;
const leagueDetailUrl = `${env.apiBaseUrl}${LEAGUES_API_PATHS.leagueDetail}`;

afterEach(() => {
  vi.restoreAllMocks();
});

describe('fetchAllLeagues', () => {
  it('returns the raw all-leagues response shape', async () => {
    const result = await fetchAllLeagues();
    expect(result).toEqual(ALL_LEAGUES_RESPONSE_FIXTURE);
  });

  it('throws an ApiError with the response status on a non-OK response', async () => {
    server.use(
      http.get(allLeaguesUrl, () => new HttpResponse(null, { status: 500 })),
    );

    await expect(fetchAllLeagues()).rejects.toThrow(ApiError);
    await expect(fetchAllLeagues()).rejects.toMatchObject({ status: 500 });
  });

  it('forwards the abort signal to the request', async () => {
    const controller = new AbortController();
    controller.abort();

    await expect(fetchAllLeagues(controller.signal)).rejects.toThrow();
  });
});

describe('fetchSeasonBadges', () => {
  it('returns the raw seasons response shape and sends badge=1 and id', async () => {
    let capturedUrl = '';
    server.use(
      http.get(allSeasonsUrl, ({ request }) => {
        capturedUrl = request.url;
        return HttpResponse.json({
          seasons: SEASON_BADGES_BY_LEAGUE_ID['4328'],
        });
      }),
    );

    const result = await fetchSeasonBadges('4328');
    expect(result).toEqual({ seasons: SEASON_BADGES_BY_LEAGUE_ID['4328'] });

    const params = new URL(capturedUrl).searchParams;
    expect(params.get('badge')).toBe('1');
    expect(params.get('id')).toBe('4328');
  });

  it('throws an ApiError with the response status on a non-OK response', async () => {
    server.use(
      http.get(allSeasonsUrl, () => new HttpResponse(null, { status: 500 })),
    );

    await expect(fetchSeasonBadges('4328')).rejects.toThrow(ApiError);
    await expect(fetchSeasonBadges('4328')).rejects.toMatchObject({
      status: 500,
    });
  });

  it('forwards the abort signal to the request', async () => {
    const controller = new AbortController();
    controller.abort();

    await expect(
      fetchSeasonBadges('4328', controller.signal),
    ).rejects.toThrow();
  });
});

describe('fetchLeagueDetail', () => {
  it('returns the raw league detail response shape', async () => {
    const result = await fetchLeagueDetail('4328');
    expect(result).toEqual({ leagues: [LEAGUE_DETAIL_DTOS_BY_ID['4328']] });
  });

  it('throws an ApiError with the response status on a non-OK response', async () => {
    server.use(
      http.get(leagueDetailUrl, () => new HttpResponse(null, { status: 500 })),
    );

    await expect(fetchLeagueDetail('4328')).rejects.toThrow(ApiError);
    await expect(fetchLeagueDetail('4328')).rejects.toMatchObject({
      status: 500,
    });
  });

  it('forwards the abort signal to the request', async () => {
    const controller = new AbortController();
    controller.abort();

    await expect(
      fetchLeagueDetail('4328', controller.signal),
    ).rejects.toThrow();
  });
});

describe('non-JSON responses', () => {
  afterEach(() => {
    server.resetHandlers();
  });

  it('throws ApiError when a 200 carries a plain-text body', async () => {
    server.use(
      http.get(`${env.apiBaseUrl}${LEAGUES_API_PATHS.allLeagues}`, () =>
        HttpResponse.text('The service is temporarily unavailable', {
          status: 200,
        }),
      ),
    );

    await expect(fetchAllLeagues()).rejects.toBeInstanceOf(ApiError);
  });

  it('reports the offending body in the error message', async () => {
    server.use(
      http.get(`${env.apiBaseUrl}${LEAGUES_API_PATHS.allLeagues}`, () =>
        HttpResponse.text('Rate limit exceeded', { status: 200 }),
      ),
    );

    await expect(fetchAllLeagues()).rejects.toThrow(/Rate limit exceeded/);
  });
});
