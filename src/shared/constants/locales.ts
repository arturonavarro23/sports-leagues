export const SUPPORTED_LOCALES = ['en', 'es'] as const;

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: SupportedLocale = 'en';

// The slug stays untranslated so a shared link keeps working when the reader
// switches language: only the locale segment differs between /en and /es.
export const ROUTE_SEGMENTS = {
  leagues: 'leagues',
} as const;
