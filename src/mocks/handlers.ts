import { http, HttpResponse } from 'msw';
import { env } from '@/shared/config/env';
import { LEAGUES_API_PATHS } from '@/domains/leagues/constants/api';
import {
  ALL_LEAGUES_RESPONSE_FIXTURE,
  LEAGUE_DETAIL_DTOS_BY_ID,
  LEAGUE_ID_WITH_BADGE_ERROR,
  LEAGUE_ID_WITH_EMPTY_SEASONS,
  SEASON_BADGES_BY_LEAGUE_ID,
} from './leagueFixtures';

const allLeaguesUrl = `${env.apiBaseUrl}${LEAGUES_API_PATHS.allLeagues}`;
const allSeasonsUrl = `${env.apiBaseUrl}${LEAGUES_API_PATHS.allSeasons}`;
const leagueDetailUrl = `${env.apiBaseUrl}${LEAGUES_API_PATHS.leagueDetail}`;

export const handlers = [
  http.get(allLeaguesUrl, () =>
    HttpResponse.json(ALL_LEAGUES_RESPONSE_FIXTURE),
  ),

  http.get(allSeasonsUrl, ({ request }) => {
    const leagueId = new URL(request.url).searchParams.get('id');

    if (!leagueId) {
      return HttpResponse.json({ seasons: null });
    }

    if (leagueId === LEAGUE_ID_WITH_BADGE_ERROR) {
      return new HttpResponse(null, { status: 500 });
    }

    if (leagueId === LEAGUE_ID_WITH_EMPTY_SEASONS) {
      return HttpResponse.json({ seasons: null });
    }

    return HttpResponse.json({
      seasons: SEASON_BADGES_BY_LEAGUE_ID[leagueId] ?? null,
    });
  }),

  http.get(leagueDetailUrl, ({ request }) => {
    const leagueId = new URL(request.url).searchParams.get('id');
    if (!leagueId) return HttpResponse.json({ leagues: null });

    return HttpResponse.json({
      leagues: LEAGUE_DETAIL_DTOS_BY_ID[leagueId]
        ? [LEAGUE_DETAIL_DTOS_BY_ID[leagueId]]
        : null,
    });
  }),
];

export const errorHandlers = {
  leaguesServerError: http.get(
    allLeaguesUrl,
    () => new HttpResponse(null, { status: 500 }),
  ),
  leaguesNetworkError: http.get(allLeaguesUrl, () => HttpResponse.error()),
  leaguesEmpty: http.get(allLeaguesUrl, () =>
    HttpResponse.json({ leagues: null }),
  ),
  seasonBadgeServerError: http.get(
    allSeasonsUrl,
    () => new HttpResponse(null, { status: 500 }),
  ),
  leagueDetailServerError: http.get(
    leagueDetailUrl,
    () => new HttpResponse(null, { status: 500 }),
  ),
};
