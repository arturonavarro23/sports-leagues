export const THEME_PREFERENCES = ['light', 'dark'] as const;

export type ThemePreference = (typeof THEME_PREFERENCES)[number];

export type ResolvedTheme = ThemePreference;

export const DARK_COLOR_SCHEME_QUERY = '(prefers-color-scheme: dark)';

export const THEME_ATTRIBUTE = 'data-theme';

export function isThemePreference(value: unknown): value is ThemePreference {
  return (
    typeof value === 'string' &&
    (THEME_PREFERENCES as readonly string[]).includes(value)
  );
}

// There is no 'system' preference to keep following, so the OS only decides the
// very first visit; after that the stored choice wins.
export function resolveInitialThemePreference(
  storedPreference: string | null,
  prefersDark: boolean,
): ThemePreference {
  if (isThemePreference(storedPreference)) return storedPreference;
  return prefersDark ? 'dark' : 'light';
}
