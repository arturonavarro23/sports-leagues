import { describe, expect, it } from 'vitest';
import type {
  AllLeaguesResponseDto,
  LeagueDto,
} from '@/domains/leagues/api/leagues.dto';
import { mapAllLeaguesResponse, mapLeagueDtoToLeague } from './leagueMapper';

describe('mapLeagueDtoToLeague', () => {
  it('maps a valid DTO to a domain League', () => {
    const dto: LeagueDto = {
      idLeague: '4328',
      strLeague: 'English Premier League',
      strSport: 'Soccer',
      strLeagueAlternate: 'Premier League, EPL',
    };

    expect(mapLeagueDtoToLeague(dto)).toEqual({
      id: '4328',
      name: 'English Premier League',
      sport: 'Soccer',
      alternateNames: ['Premier League', 'EPL'],
    });
  });

  it('defaults sport to an empty string when missing', () => {
    const dto: LeagueDto = {
      idLeague: '4328',
      strLeague: 'English Premier League',
      strSport: null,
    };

    expect(mapLeagueDtoToLeague(dto)?.sport).toBe('');
  });

  it('returns null when idLeague is null', () => {
    const dto: LeagueDto = {
      idLeague: null,
      strLeague: 'English Premier League',
      strSport: 'Soccer',
    };

    expect(mapLeagueDtoToLeague(dto)).toBeNull();
  });

  it('returns null when strLeague is null', () => {
    const dto: LeagueDto = {
      idLeague: '4328',
      strLeague: null,
      strSport: 'Soccer',
    };

    expect(mapLeagueDtoToLeague(dto)).toBeNull();
  });

  it('defaults alternateNames to an empty array when the field is absent', () => {
    const dto: LeagueDto = {
      idLeague: '4328',
      strLeague: 'English Premier League',
      strSport: 'Soccer',
    };

    expect(mapLeagueDtoToLeague(dto)?.alternateNames).toEqual([]);
  });
});

describe('mapAllLeaguesResponse', () => {
  it('maps every valid league in the response', () => {
    const response: AllLeaguesResponseDto = {
      leagues: [
        { idLeague: '1', strLeague: 'A', strSport: 'Soccer' },
        { idLeague: '2', strLeague: 'B', strSport: 'Basketball' },
      ],
    };

    expect(mapAllLeaguesResponse(response)).toHaveLength(2);
  });

  it('returns an empty array when leagues is null', () => {
    expect(mapAllLeaguesResponse({ leagues: null })).toEqual([]);
  });

  it('drops invalid entries while keeping valid ones', () => {
    const response: AllLeaguesResponseDto = {
      leagues: [
        { idLeague: null, strLeague: 'Invalid', strSport: 'Soccer' },
        { idLeague: '2', strLeague: 'Valid', strSport: 'Basketball' },
      ],
    };

    const result = mapAllLeaguesResponse(response);
    expect(result).toHaveLength(1);
    expect(result[0]?.id).toBe('2');
  });
});
