export const PERSISTED_CACHE = {
  storageKey: 'sports-leagues-query-cache',
  maxAgeMs: 24 * 60 * 60 * 1000,
  // Bump whenever a domain model or mapper output changes shape, otherwise a
  // stored payload deserialises into code that no longer understands it.
  schemaVersion: '1',
} as const;

// The API mode is part of the key so switching between the live API and the
// mock dataset discards the other mode's cache instead of hydrating it.
export function buildCacheBuster(isMockApiEnabled: boolean): string {
  return `${PERSISTED_CACHE.schemaVersion}-${isMockApiEnabled ? 'mock' : 'live'}`;
}
