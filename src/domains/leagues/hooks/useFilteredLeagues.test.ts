import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { League } from '../models/league';
import { ALL_SPORTS_VALUE } from '../constants/filters';
import { useFilteredLeagues } from './useFilteredLeagues';

const premierLeague: League = {
  id: '4328',
  name: 'English Premier League',
  sport: 'Soccer',
  alternateNames: ['EPL'],
};

const nba: League = {
  id: '4387',
  name: 'NBA',
  sport: 'Basketball',
  alternateNames: [],
};

const leagues = [premierLeague, nba];

describe('useFilteredLeagues', () => {
  it('returns all leagues when there are no filters', () => {
    const { result } = renderHook(() =>
      useFilteredLeagues(leagues, { search: '', sport: ALL_SPORTS_VALUE }),
    );
    expect(result.current).toEqual(leagues);
  });

  it('filters by search term, including alternate names', () => {
    const { result } = renderHook(() =>
      useFilteredLeagues(leagues, { search: 'epl', sport: ALL_SPORTS_VALUE }),
    );
    expect(result.current).toEqual([premierLeague]);
  });

  it('filters by sport', () => {
    const { result } = renderHook(() =>
      useFilteredLeagues(leagues, { search: '', sport: 'Basketball' }),
    );
    expect(result.current).toEqual([nba]);
  });

  it('combines search and sport filters', () => {
    const { result } = renderHook(() =>
      useFilteredLeagues(leagues, { search: 'premier', sport: 'Basketball' }),
    );
    expect(result.current).toEqual([]);
  });

  it('returns an empty array when nothing matches', () => {
    const { result } = renderHook(() =>
      useFilteredLeagues(leagues, {
        search: 'cricket',
        sport: ALL_SPORTS_VALUE,
      }),
    );
    expect(result.current).toEqual([]);
  });

  it('recomputes when the inputs change', () => {
    const { result, rerender } = renderHook(
      ({ search }) =>
        useFilteredLeagues(leagues, { search, sport: ALL_SPORTS_VALUE }),
      { initialProps: { search: 'nba' } },
    );
    expect(result.current).toEqual([nba]);

    rerender({ search: 'premier' });
    expect(result.current).toEqual([premierLeague]);
  });
});
