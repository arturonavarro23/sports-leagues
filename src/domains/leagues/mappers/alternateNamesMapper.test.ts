import { describe, expect, it } from 'vitest';
import { parseAlternateNames } from './alternateNamesMapper';

describe('parseAlternateNames', () => {
  it('splits a comma-separated string and trims each value', () => {
    expect(parseAlternateNames('Premier League, EPL, England')).toEqual([
      'Premier League',
      'EPL',
      'England',
    ]);
  });

  it('trims trailing whitespace around a single value', () => {
    expect(parseAlternateNames('bet-at-home ICE Hockey League ')).toEqual([
      'bet-at-home ICE Hockey League',
    ]);
  });

  it('returns an empty array for an empty string', () => {
    expect(parseAlternateNames('')).toEqual([]);
  });

  it('returns an empty array for null', () => {
    expect(parseAlternateNames(null)).toEqual([]);
  });

  it('returns an empty array for undefined', () => {
    expect(parseAlternateNames(undefined)).toEqual([]);
  });

  it('returns truncated junk as a single entry', () => {
    expect(parseAlternateNames('Women')).toEqual(['Women']);
  });

  it('drops empty segments produced by consecutive commas', () => {
    expect(parseAlternateNames('EPL,, England,')).toEqual(['EPL', 'England']);
  });

  it('dedupes case-insensitively keeping the first spelling', () => {
    expect(parseAlternateNames('EPL, epl, Epl, England')).toEqual([
      'EPL',
      'England',
    ]);
  });

  it('returns an empty array for a whitespace-only string', () => {
    expect(parseAlternateNames('   ')).toEqual([]);
  });
});
