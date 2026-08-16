import { useMemo } from 'react';
import type { League, SportOption } from '../models/league';
import { buildSportOptions } from '../utils/sportOptions';

export function useSportOptions(leagues: League[]): SportOption[] {
  return useMemo(() => buildSportOptions(leagues), [leagues]);
}
