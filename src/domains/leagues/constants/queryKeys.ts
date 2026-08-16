export const QUERY_KEYS = {
  leagues: ['leagues'] as const,
  seasonBadge: (leagueId: string) => ['seasonBadge', leagueId] as const,
  leagueDetail: (leagueId: string) => ['leagueDetail', leagueId] as const,
} as const;

const MINUTE_MS = 60 * 1000;

// staleTime is what prevents repeat requests; gcTime only decides how long an
// unobserved entry survives, and the cache is in-memory so it dies on reload.
export const QUERY_CACHE_DURATIONS = {
  leaguesStaleTimeMs: 10 * MINUTE_MS,
  leaguesGcTimeMs: 20 * MINUTE_MS,
  seasonBadgeStaleTimeMs: Number.POSITIVE_INFINITY,
  // A badge that was not found may simply have been unavailable at that moment,
  // so an empty result is revalidated instead of being cached for the session.
  seasonBadgeEmptyStaleTimeMs: MINUTE_MS,
  seasonBadgeGcTimeMs: 60 * MINUTE_MS,
  leagueDetailStaleTimeMs: Number.POSITIVE_INFINITY,
  leagueDetailGcTimeMs: 120 * MINUTE_MS,
} as const;

// One retry, so a transient blip recovers without a rate-limited request
// spending more of the API's 30-per-minute budget making things worse.
export const QUERY_RETRY = {
  count: 1,
  baseDelayMs: 300,
} as const;
