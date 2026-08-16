import { describe, expect, it } from 'vitest';
import { applyLeagueDetail } from './applyLeagueDetail';
import type { League, LeagueDetail } from '@/domains/leagues/models';

const leagues: League[] = [
  { id: '1', name: 'Alpha', sport: 'Soccer', alternateNames: [] },
  { id: '2', name: 'Beta', sport: 'Soccer', alternateNames: ['B'] },
];

const detail: LeagueDetail = {
  id: '1',
  alternateNames: ['Alfa', 'A'],
  currentSeason: null,
  formedYear: null,
};

describe('applyLeagueDetail', () => {
  it('fills in alternate names for the matching league only', () => {
    const result = applyLeagueDetail(leagues, detail);

    expect(result[0]?.alternateNames).toEqual(['Alfa', 'A']);
    expect(result[1]?.alternateNames).toEqual(['B']);
  });

  it('returns the original list when there is no detail', () => {
    expect(applyLeagueDetail(leagues, null)).toBe(leagues);
    expect(applyLeagueDetail(leagues, undefined)).toBe(leagues);
  });

  it('returns the original list when the detail carries no alternate names', () => {
    expect(applyLeagueDetail(leagues, { ...detail, alternateNames: [] })).toBe(
      leagues,
    );
  });

  it('leaves the list untouched when no league matches the detail', () => {
    const result = applyLeagueDetail(leagues, { ...detail, id: 'missing' });

    expect(result.map((league) => league.alternateNames)).toEqual([[], ['B']]);
  });

  it('does not mutate the input', () => {
    applyLeagueDetail(leagues, detail);

    expect(leagues[0]?.alternateNames).toEqual([]);
  });
});
