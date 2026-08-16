import { describe, expect, it } from 'vitest';
import { normalizeText } from './normalizeText';

describe('normalizeText', () => {
  it('trims surrounding whitespace', () => {
    expect(normalizeText('  Premier League  ')).toBe('premier league');
  });

  it('lowercases the value', () => {
    expect(normalizeText('SOCCER')).toBe('soccer');
  });

  it('returns an empty string for whitespace only input', () => {
    expect(normalizeText('   ')).toBe('');
  });
});
