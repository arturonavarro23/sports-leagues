import { useParams } from 'react-router';
import { DEFAULT_LOCALE } from '@/shared/constants/locales';
import { isSupportedLocale } from '@/shared/i18n/localePath';
import { useLocaleSync } from '@/app/router/useLocaleSync';
import { AppLayout } from '@/app/layouts';

// Syncs i18next to the pathname before rendering the layout, so the header is
// already in the right language on first paint.
export function LocaleLeaguesRoute() {
  const { locale } = useParams();
  const activeLocale = isSupportedLocale(locale) ? locale : DEFAULT_LOCALE;
  useLocaleSync(activeLocale);

  return <AppLayout />;
}
