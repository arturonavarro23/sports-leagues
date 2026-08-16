import type { League, SportOption } from '../models/league';
import { ALL_SPORTS_VALUE } from '../constants/filters';

export function buildSportOptions(leagues: League[]): SportOption[] {
  const uniqueSports = Array.from(
    new Set(leagues.map((league) => league.sport)),
  ).sort((a, b) => a.localeCompare(b));

  return [
    { value: ALL_SPORTS_VALUE, label: 'All sports' },
    ...uniqueSports.map((sport) => ({ value: sport, label: sport })),
  ];
}
