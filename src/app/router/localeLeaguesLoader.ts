import type { LoaderFunctionArgs } from 'react-router';
import { isSupportedLocale } from '@/shared/i18n/localePath';

export function localeLeaguesLoader({ params }: LoaderFunctionArgs) {
  if (!isSupportedLocale(params.locale)) {
    throw new Response(null, { status: 404 });
  }
  return null;
}
