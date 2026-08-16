import type { StorageKey } from '@/shared/constants/storage';

// localStorage throws rather than returning null in Safari private mode, when
// storage is disabled by policy, and when the quota is exceeded. Startup reads
// a preference before React paints, so an unhandled throw there is a blank page.
function getStorage(): Storage | null {
  try {
    if (typeof window === 'undefined') return null;
    return window.localStorage;
  } catch {
    return null;
  }
}

export function readStoredValue<T extends string>(
  key: StorageKey,
  isValid: (value: string) => value is T,
): T | null {
  try {
    const raw = getStorage()?.getItem(key);
    if (raw === null || raw === undefined) return null;
    return isValid(raw) ? raw : null;
  } catch {
    return null;
  }
}

export function writeStoredValue(key: StorageKey, value: string): void {
  try {
    getStorage()?.setItem(key, value);
  } catch {
    // A preference that cannot be saved is not worth breaking the app over.
  }
}
