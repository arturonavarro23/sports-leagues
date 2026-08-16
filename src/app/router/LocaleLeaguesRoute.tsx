import { useParams } from 'react-router';
import { DEFAULT_LOCALE } from '@/shared/constants/locales';
import { isSupportedLocale } from '@/shared/i18n/localePath';
import { useLocaleSync } from '@/app/router/useLocaleSync';
import { LeaguesRoute } from '@/app/router/LeaguesRoute';

export function LocaleLeaguesRoute() {
  const { locale } = useParams();
  const activeLocale = isSupportedLocale(locale) ? locale : DEFAULT_LOCALE;
  useLocaleSync(activeLocale);

  return <LeaguesRoute />;
}
