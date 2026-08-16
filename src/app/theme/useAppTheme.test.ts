import { beforeEach, describe, expect, it } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useAppTheme } from './useAppTheme';
import { useLeaguePreferencesStore } from '@/domains/leagues/stores/leaguePreferencesStore';
import { THEME_ATTRIBUTE } from '@/shared/theme/themeTypes';

describe('useAppTheme', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute(THEME_ATTRIBUTE);
  });

  it('applies a saved light preference to the root element', () => {
    useLeaguePreferencesStore.setState({ themePreference: 'light' });

    const { result } = renderHook(() => useAppTheme());

    expect(result.current).toBe('light');
    expect(document.documentElement.getAttribute(THEME_ATTRIBUTE)).toBe(
      'light',
    );
  });

  it('applies a saved dark preference to the root element', () => {
    useLeaguePreferencesStore.setState({ themePreference: 'dark' });

    const { result } = renderHook(() => useAppTheme());

    expect(result.current).toBe('dark');
    expect(document.documentElement.getAttribute(THEME_ATTRIBUTE)).toBe('dark');
  });

  it('updates the root element when the preference changes', () => {
    useLeaguePreferencesStore.setState({ themePreference: 'light' });
    const { rerender } = renderHook(() => useAppTheme());

    useLeaguePreferencesStore.getState().setThemePreference('dark');
    rerender();

    expect(document.documentElement.getAttribute(THEME_ATTRIBUTE)).toBe('dark');
  });
});
