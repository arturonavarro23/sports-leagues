import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { League } from '../models/league';
import { ALL_SPORTS_VALUE } from '../constants/filters';
import { useSportOptions } from './useSportOptions';

function makeLeague(sport: string): League {
  return { id: sport, name: sport, sport, alternateNames: [] };
}

describe('useSportOptions', () => {
  it('derives a sorted, unique sport list led by "All sports"', () => {
    const leagues = [
      makeLeague('Soccer'),
      makeLeague('Basketball'),
      makeLeague('Soccer'),
    ];
    const { result } = renderHook(() => useSportOptions(leagues));

    expect(result.current).toEqual([
      { value: ALL_SPORTS_VALUE, label: 'All sports' },
      { value: 'Basketball', label: 'Basketball' },
      { value: 'Soccer', label: 'Soccer' },
    ]);
  });

  it('returns only "All sports" for an empty list', () => {
    const { result } = renderHook(() => useSportOptions([]));
    expect(result.current).toEqual([
      { value: ALL_SPORTS_VALUE, label: 'All sports' },
    ]);
  });
});
