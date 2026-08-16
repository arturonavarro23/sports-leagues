import { describe, expect, it } from 'vitest';
import type { League } from '../models/league';
import { ALL_SPORTS_VALUE } from '../constants/filters';
import { buildSportOptions } from './sportOptions';

function makeLeague(sport: string): League {
  return { id: sport, name: sport, sport, alternateNames: [] };
}

describe('buildSportOptions', () => {
  it('puts an "All sports" option first', () => {
    const options = buildSportOptions([makeLeague('Soccer')]);
    expect(options[0]).toEqual({
      value: ALL_SPORTS_VALUE,
      label: 'All sports',
    });
  });

  it('derives the unique sport list sorted alphabetically', () => {
    const options = buildSportOptions([
      makeLeague('Soccer'),
      makeLeague('Basketball'),
      makeLeague('Soccer'),
      makeLeague('American Football'),
    ]);

    expect(options.slice(1)).toEqual([
      { value: 'American Football', label: 'American Football' },
      { value: 'Basketball', label: 'Basketball' },
      { value: 'Soccer', label: 'Soccer' },
    ]);
  });

  it('returns only the "All sports" option for an empty list', () => {
    expect(buildSportOptions([])).toEqual([
      { value: ALL_SPORTS_VALUE, label: 'All sports' },
    ]);
  });
});
