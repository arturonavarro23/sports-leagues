import { create } from 'zustand';
import { STORAGE_KEYS } from '@/shared/constants/storage';
import {
  readStoredValue,
  writeStoredValue,
} from '@/shared/storage/safeLocalStorage';
import {
  DARK_COLOR_SCHEME_QUERY,
  isThemePreference,
  resolveInitialThemePreference,
  type ThemePreference,
} from '@/shared/theme/themeTypes';

export type ViewMode = 'grid' | 'list';

export const DEFAULT_VIEW_MODE: ViewMode = 'grid';

function readInitialThemePreference(): ThemePreference {
  const stored = readStoredValue(STORAGE_KEYS.theme, isThemePreference);
  const prefersDark =
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia(DARK_COLOR_SCHEME_QUERY).matches;

  return resolveInitialThemePreference(stored, prefersDark);
}

interface LeaguePreferencesState {
  viewMode: ViewMode;
  setViewMode: (viewMode: ViewMode) => void;
  themePreference: ThemePreference;
  setThemePreference: (themePreference: ThemePreference) => void;
}

export const useLeaguePreferencesStore = create<LeaguePreferencesState>(
  (set) => ({
    viewMode: DEFAULT_VIEW_MODE,
    setViewMode: (viewMode) => set({ viewMode }),
    themePreference: readInitialThemePreference(),
    setThemePreference: (themePreference) => {
      writeStoredValue(STORAGE_KEYS.theme, themePreference);
      set({ themePreference });
    },
  }),
);
