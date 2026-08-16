import { useEffect } from 'react';
import { useLeaguePreferencesStore } from '@/domains/leagues/stores/leaguePreferencesStore';
import { THEME_ATTRIBUTE, type ResolvedTheme } from '@/shared/theme/themeTypes';

export function useAppTheme(): ResolvedTheme {
  const themePreference = useLeaguePreferencesStore(
    (state) => state.themePreference,
  );

  useEffect(() => {
    document.documentElement.setAttribute(THEME_ATTRIBUTE, themePreference);
  }, [themePreference]);

  return themePreference;
}
