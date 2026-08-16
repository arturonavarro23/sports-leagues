import { describe, expect, it } from 'vitest';
import type { LookupLeagueResponseDto } from '@/domains/leagues/api/leagues.dto';
import { mapLookupLeagueResponse } from './leagueDetailMapper';

describe('mapLookupLeagueResponse', () => {
  it('maps a valid response to a LeagueDetail', () => {
    const response: LookupLeagueResponseDto = {
      leagues: [
        {
          idLeague: '4328',
          strLeague: 'English Premier League',
          strSport: 'Soccer',
          strLeagueAlternate: 'Premier League, EPL, England',
          strCurrentSeason: '2025-2026',
          intFormedYear: '1992',
        },
      ],
    };

    expect(mapLookupLeagueResponse(response, '4328')).toEqual({
      id: '4328',
      alternateNames: ['Premier League', 'EPL', 'England'],
      currentSeason: '2025-2026',
      formedYear: '1992',
    });
  });

  it('returns null when leagues is null', () => {
    expect(mapLookupLeagueResponse({ leagues: null }, '4328')).toBeNull();
  });

  it('returns null when leagues is empty', () => {
    expect(mapLookupLeagueResponse({ leagues: [] }, '4328')).toBeNull();
  });

  it('returns null when the matching league entry has no idLeague', () => {
    const response: LookupLeagueResponseDto = {
      leagues: [
        {
          idLeague: null,
          strLeague: null,
          strSport: null,
        },
      ],
    };

    expect(mapLookupLeagueResponse(response, '4328')).toBeNull();
  });

  it('defaults currentSeason and formedYear to null when absent', () => {
    const response: LookupLeagueResponseDto = {
      leagues: [
        {
          idLeague: '4328',
          strLeague: 'English Premier League',
          strSport: 'Soccer',
        },
      ],
    };

    const result = mapLookupLeagueResponse(response, '4328');
    expect(result?.currentSeason).toBeNull();
    expect(result?.formedYear).toBeNull();
  });

  it('defaults alternateNames to an empty array when absent', () => {
    const response: LookupLeagueResponseDto = {
      leagues: [
        {
          idLeague: '4328',
          strLeague: 'English Premier League',
          strSport: 'Soccer',
        },
      ],
    };

    expect(mapLookupLeagueResponse(response, '4328')?.alternateNames).toEqual(
      [],
    );
  });

  it('uses the requested leagueId as the id, falling back to the first entry', () => {
    const response: LookupLeagueResponseDto = {
      leagues: [
        {
          idLeague: '4328',
          strLeague: 'English Premier League',
          strSport: 'Soccer',
        },
      ],
    };

    expect(mapLookupLeagueResponse(response, '4328')?.id).toBe('4328');
  });
});
