import { env } from '@/shared/config/env';
import {
  LEAGUE_DETAIL_QUERY_PARAMS,
  LEAGUES_API_PATHS,
  SEASON_BADGE_QUERY_PARAMS,
} from '@/domains/leagues/constants/api';
import type {
  AllLeaguesResponseDto,
  AllSeasonsResponseDto,
  LookupLeagueResponseDto,
} from './leagues.dto';
import { ApiError } from './apiError';

async function getJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new ApiError(response.status, `Request to ${url} failed`);
  }

  // TheSportsDB answers rate-limited requests with HTTP 200 and a plain-text
  // body, so an ok status is not enough to assume the payload is JSON.
  const body = await response.text();
  try {
    return JSON.parse(body) as T;
  } catch {
    throw new ApiError(
      response.status,
      `Request to ${url} returned a non-JSON body: ${body.slice(0, 80)}`,
    );
  }
}

export async function fetchAllLeagues(
  signal?: AbortSignal,
): Promise<AllLeaguesResponseDto> {
  const url = `${env.apiBaseUrl}${LEAGUES_API_PATHS.allLeagues}`;
  return getJson<AllLeaguesResponseDto>(url, signal);
}

export async function fetchSeasonBadges(
  leagueId: string,
  signal?: AbortSignal,
): Promise<AllSeasonsResponseDto> {
  const params = new URLSearchParams({
    [SEASON_BADGE_QUERY_PARAMS.badge]: '1',
    [SEASON_BADGE_QUERY_PARAMS.leagueId]: leagueId,
  });
  const url = `${env.apiBaseUrl}${LEAGUES_API_PATHS.allSeasons}?${params.toString()}`;
  return getJson<AllSeasonsResponseDto>(url, signal);
}

export async function fetchLeagueDetail(
  leagueId: string,
  signal?: AbortSignal,
): Promise<LookupLeagueResponseDto> {
  const params = new URLSearchParams({
    [LEAGUE_DETAIL_QUERY_PARAMS.leagueId]: leagueId,
  });
  const url = `${env.apiBaseUrl}${LEAGUES_API_PATHS.leagueDetail}?${params.toString()}`;
  return getJson<LookupLeagueResponseDto>(url, signal);
}
