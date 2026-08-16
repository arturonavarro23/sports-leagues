import { Navigate } from 'react-router';
import { STORAGE_KEYS } from '@/shared/constants/storage';
import { readStoredValue } from '@/shared/storage/safeLocalStorage';
import {
  buildLocalePath,
  isSupportedLocale,
  resolveInitialLocale,
} from '@/shared/i18n/localePath';

export function RootRedirect() {
  const storedLocale = readStoredValue(
    STORAGE_KEYS.language,
    isSupportedLocale,
  );
  const browserLanguages =
    typeof navigator === 'undefined' ? undefined : navigator.languages;
  const locale = resolveInitialLocale(storedLocale, browserLanguages);

  return <Navigate to={buildLocalePath(locale)} replace />;
}
