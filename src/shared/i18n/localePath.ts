import {
  DEFAULT_LOCALE,
  ROUTE_SEGMENTS,
  SUPPORTED_LOCALES,
  type SupportedLocale,
} from '@/shared/constants/locales';

export function isSupportedLocale(value: unknown): value is SupportedLocale {
  return (
    typeof value === 'string' &&
    (SUPPORTED_LOCALES as readonly string[]).includes(value)
  );
}

export function getLocaleFromPathname(
  pathname: string,
): SupportedLocale | null {
  const segment = pathname.split('/').filter(Boolean)[0];
  return isSupportedLocale(segment) ? segment : null;
}

export function buildLocalePath(
  locale: SupportedLocale,
  segment: string = ROUTE_SEGMENTS.leagues,
): string {
  return `/${locale}/${segment}`;
}

// Only the locale segment changes; every other segment and the whole query
// string are preserved so a switch never loses the reader's place.
export function switchLocaleInPath(
  pathname: string,
  search: string,
  nextLocale: SupportedLocale,
): string {
  const segments = pathname.split('/').filter(Boolean);
  if (isSupportedLocale(segments[0])) {
    segments[0] = nextLocale;
  } else {
    segments.unshift(nextLocale);
  }
  return `/${segments.join('/')}${search}`;
}

export function resolveBrowserLocale(
  languages: readonly string[] | undefined,
): SupportedLocale | null {
  for (const language of languages ?? []) {
    const base = language.split('-')[0];
    if (isSupportedLocale(base)) return base;
  }
  return null;
}

export function resolveInitialLocale(
  storedLocale: string | null,
  browserLanguages: readonly string[] | undefined,
): SupportedLocale {
  if (isSupportedLocale(storedLocale)) return storedLocale;
  return resolveBrowserLocale(browserLanguages) ?? DEFAULT_LOCALE;
}
