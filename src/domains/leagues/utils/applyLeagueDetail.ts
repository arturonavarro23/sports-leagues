import type { League, LeagueDetail } from '@/domains/leagues/models';

// The list endpoint no longer returns alternate names, so the selected league's
// entry is completed from the detail lookup. See ADR 0002.
export function applyLeagueDetail(
  leagues: League[],
  detail: LeagueDetail | null | undefined,
): League[] {
  if (!detail || detail.alternateNames.length === 0) return leagues;

  return leagues.map((league) =>
    league.id === detail.id
      ? { ...league, alternateNames: detail.alternateNames }
      : league,
  );
}
