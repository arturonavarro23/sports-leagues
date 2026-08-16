import { describe, expect, it } from 'vitest';
import type { League } from '../models/league';
import { ALL_SPORTS_VALUE } from '../constants/filters';
import { filterLeagues, matchesSearch, matchesSport } from './leagueFilters';

const premierLeague: League = {
  id: '4328',
  name: 'English Premier League',
  sport: 'Soccer',
  alternateNames: ['EPL', 'Premier League'],
};

const nba: League = {
  id: '4387',
  name: 'NBA',
  sport: 'Basketball',
  alternateNames: [],
};

const leagues = [premierLeague, nba];

describe('matchesSearch', () => {
  it('matches on the league name (case-insensitive, substring)', () => {
    expect(matchesSearch(premierLeague, 'premier')).toBe(true);
    expect(matchesSearch(premierLeague, 'PREMIER')).toBe(true);
  });

  it('matches on an alternate name', () => {
    expect(matchesSearch(premierLeague, 'epl')).toBe(true);
  });

  it('is whitespace tolerant', () => {
    expect(matchesSearch(premierLeague, '  premier  ')).toBe(true);
  });

  it('returns false when nothing matches', () => {
    expect(matchesSearch(premierLeague, 'hockey')).toBe(false);
  });

  it('treats an empty or whitespace-only query as no filter', () => {
    expect(matchesSearch(premierLeague, '')).toBe(true);
    expect(matchesSearch(premierLeague, '   ')).toBe(true);
  });
});

describe('matchesSport', () => {
  it('matches an exact sport', () => {
    expect(matchesSport(premierLeague, 'Soccer')).toBe(true);
    expect(matchesSport(nba, 'Soccer')).toBe(false);
  });

  it('treats ALL_SPORTS_VALUE as no filter', () => {
    expect(matchesSport(premierLeague, ALL_SPORTS_VALUE)).toBe(true);
    expect(matchesSport(nba, ALL_SPORTS_VALUE)).toBe(true);
  });
});

describe('filterLeagues', () => {
  it('applies the search filter only', () => {
    expect(
      filterLeagues(leagues, { search: 'nba', sport: ALL_SPORTS_VALUE }),
    ).toEqual([nba]);
  });

  it('applies the sport filter only', () => {
    expect(filterLeagues(leagues, { search: '', sport: 'Basketball' })).toEqual(
      [nba],
    );
  });

  it('combines search and sport filters (AND)', () => {
    expect(
      filterLeagues(leagues, { search: 'premier', sport: 'Basketball' }),
    ).toEqual([]);
    expect(
      filterLeagues(leagues, { search: 'premier', sport: 'Soccer' }),
    ).toEqual([premierLeague]);
  });

  it('returns an empty array when nothing matches', () => {
    expect(
      filterLeagues(leagues, { search: 'cricket', sport: ALL_SPORTS_VALUE }),
    ).toEqual([]);
  });

  it('returns every league when both filters are inactive', () => {
    expect(
      filterLeagues(leagues, { search: '', sport: ALL_SPORTS_VALUE }),
    ).toEqual(leagues);
  });
});
