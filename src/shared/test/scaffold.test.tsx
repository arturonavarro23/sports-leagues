import { describe, expect, it } from 'vitest';
import { env } from '@/shared/config/env';
import { LEAGUES_API_PATHS } from '@/domains/leagues/constants/api';

describe('scaffold', () => {
  it('serves mocked leagues through MSW', async () => {
    const response = await fetch(
      `${env.apiBaseUrl}${LEAGUES_API_PATHS.allLeagues}`,
    );
    const body = await response.json();

    expect(body.leagues.length).toBeGreaterThan(5);
    expect(body.leagues[0].strLeague).toBe('English Premier League');
  });

  it('serves mocked league detail with alternate names', async () => {
    const response = await fetch(
      `${env.apiBaseUrl}${LEAGUES_API_PATHS.leagueDetail}?id=4328`,
    );
    const body = await response.json();

    expect(body.leagues[0].strLeagueAlternate).toContain('EPL');
  });
});
