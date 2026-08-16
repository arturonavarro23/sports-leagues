import { describe, expect, it } from 'vitest';
import type { AllSeasonsResponseDto } from '@/domains/leagues/api/leagues.dto';
import { mapFirstAvailableBadge } from './seasonBadgeMapper';

describe('mapFirstAvailableBadge', () => {
  it('returns the first season with a non-empty badge', () => {
    const dto: AllSeasonsResponseDto = {
      seasons: [
        { strSeason: '1992-1993', strBadge: null },
        { strSeason: '1993-1994', strBadge: 'https://example.com/badge.png' },
        { strSeason: '1994-1995', strBadge: 'https://example.com/other.png' },
      ],
    };

    expect(mapFirstAvailableBadge(dto)).toEqual({
      season: '1993-1994',
      badgeUrl: 'https://example.com/badge.png',
    });
  });

  it('returns null when seasons is null', () => {
    expect(mapFirstAvailableBadge({ seasons: null })).toBeNull();
  });

  it('returns null when seasons is empty', () => {
    expect(mapFirstAvailableBadge({ seasons: [] })).toBeNull();
  });

  it('returns null when no season has a badge', () => {
    const dto: AllSeasonsResponseDto = {
      seasons: [
        { strSeason: '2024', strBadge: null },
        { strSeason: '2023', strBadge: '' },
      ],
    };

    expect(mapFirstAvailableBadge(dto)).toBeNull();
  });

  it('treats an empty string badge as unavailable', () => {
    const dto: AllSeasonsResponseDto = {
      seasons: [
        { strSeason: '2024', strBadge: '' },
        { strSeason: '2023', strBadge: 'https://example.com/badge.png' },
      ],
    };

    expect(mapFirstAvailableBadge(dto)).toEqual({
      season: '2023',
      badgeUrl: 'https://example.com/badge.png',
    });
  });

  it('skips a season with a missing strSeason but a valid badge', () => {
    const dto: AllSeasonsResponseDto = {
      seasons: [{ strSeason: null, strBadge: 'https://example.com/x.png' }],
    };

    expect(mapFirstAvailableBadge(dto)).toBeNull();
  });
});
