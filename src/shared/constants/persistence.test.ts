import { describe, expect, it } from 'vitest';
import { buildCacheBuster, PERSISTED_CACHE } from './persistence';

describe('buildCacheBuster', () => {
  it('produces a different buster for the mock API than for the live API', () => {
    expect(buildCacheBuster(true)).not.toBe(buildCacheBuster(false));
  });

  it('includes the schema version so a model change invalidates the cache', () => {
    expect(buildCacheBuster(false)).toContain(PERSISTED_CACHE.schemaVersion);
    expect(buildCacheBuster(true)).toContain(PERSISTED_CACHE.schemaVersion);
  });

  it('is stable for the same mode', () => {
    expect(buildCacheBuster(true)).toBe(buildCacheBuster(true));
  });
});
