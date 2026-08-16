import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { switchLocaleInPath } from '@/shared/i18n/localePath';
import type { SupportedLocale } from '@/shared/constants/locales';

// Preserves every other path segment and the whole query string; only the
// locale slug changes, so a switch never loses the reader's filters.
export function useLocaleSwitcher(): (nextLocale: SupportedLocale) => void {
  const location = useLocation();
  const navigate = useNavigate();

  return useCallback(
    (nextLocale: SupportedLocale) => {
      navigate(
        switchLocaleInPath(location.pathname, location.search, nextLocale),
      );
    },
    [location.pathname, location.search, navigate],
  );
}
