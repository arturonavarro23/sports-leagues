import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { STORAGE_KEYS } from '@/shared/constants/storage';
import {
  useLeaguePreferencesStore,
  DEFAULT_VIEW_MODE,
} from './leaguePreferencesStore';

const initialState = useLeaguePreferencesStore.getState();

function stubPrefersDark(matches: boolean): void {
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({
      matches,
      media: '',
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  );
}

beforeEach(() => {
  window.localStorage.clear();
});

afterEach(() => {
  useLeaguePreferencesStore.setState(initialState, true);
  window.localStorage.clear();
});

describe('useLeaguePreferencesStore', () => {
  it('defaults viewMode to the grid view', () => {
    expect(useLeaguePreferencesStore.getState().viewMode).toBe(
      DEFAULT_VIEW_MODE,
    );
  });

  it('sets viewMode to list', () => {
    useLeaguePreferencesStore.getState().setViewMode('list');
    expect(useLeaguePreferencesStore.getState().viewMode).toBe('list');
  });

  it('sets viewMode back to grid', () => {
    useLeaguePreferencesStore.getState().setViewMode('list');
    useLeaguePreferencesStore.getState().setViewMode('grid');
    expect(useLeaguePreferencesStore.getState().viewMode).toBe('grid');
  });

  it('sets themePreference to light and persists it', () => {
    useLeaguePreferencesStore.getState().setThemePreference('light');

    expect(useLeaguePreferencesStore.getState().themePreference).toBe('light');
    expect(window.localStorage.getItem(STORAGE_KEYS.theme)).toBe('light');
  });

  it('sets themePreference to dark and persists it', () => {
    useLeaguePreferencesStore.getState().setThemePreference('dark');

    expect(useLeaguePreferencesStore.getState().themePreference).toBe('dark');
    expect(window.localStorage.getItem(STORAGE_KEYS.theme)).toBe('dark');
  });

  it('sets themePreference back to light and persists it', () => {
    useLeaguePreferencesStore.getState().setThemePreference('dark');
    useLeaguePreferencesStore.getState().setThemePreference('light');

    expect(useLeaguePreferencesStore.getState().themePreference).toBe('light');
    expect(window.localStorage.getItem(STORAGE_KEYS.theme)).toBe('light');
  });

  it('does not throw when persisting fails', () => {
    const setItem = vi
      .spyOn(window.localStorage.__proto__, 'setItem')
      .mockImplementation(() => {
        throw new Error('storage unavailable');
      });

    try {
      expect(() =>
        useLeaguePreferencesStore.getState().setThemePreference('dark'),
      ).not.toThrow();
      expect(useLeaguePreferencesStore.getState().themePreference).toBe('dark');
    } finally {
      setItem.mockRestore();
    }
  });

  describe('initial themePreference from storage', () => {
    beforeEach(() => {
      vi.resetModules();
    });

    it('restores a saved light preference', async () => {
      window.localStorage.setItem(STORAGE_KEYS.theme, 'light');
      const { useLeaguePreferencesStore: freshStore } =
        await import('./leaguePreferencesStore');

      expect(freshStore.getState().themePreference).toBe('light');
    });

    it('restores a saved dark preference', async () => {
      window.localStorage.setItem(STORAGE_KEYS.theme, 'dark');
      const { useLeaguePreferencesStore: freshStore } =
        await import('./leaguePreferencesStore');

      expect(freshStore.getState().themePreference).toBe('dark');
    });

    it('follows a dark operating system when nothing is stored', async () => {
      stubPrefersDark(true);
      const { useLeaguePreferencesStore: freshStore } =
        await import('./leaguePreferencesStore');

      expect(freshStore.getState().themePreference).toBe('dark');
    });

    it('follows a light operating system when nothing is stored', async () => {
      stubPrefersDark(false);
      const { useLeaguePreferencesStore: freshStore } =
        await import('./leaguePreferencesStore');

      expect(freshStore.getState().themePreference).toBe('light');
    });

    it('falls back to the operating system when the stored value is invalid', async () => {
      window.localStorage.setItem(STORAGE_KEYS.theme, 'purple');
      stubPrefersDark(true);
      const { useLeaguePreferencesStore: freshStore } =
        await import('./leaguePreferencesStore');

      expect(freshStore.getState().themePreference).toBe('dark');
    });
  });
});
