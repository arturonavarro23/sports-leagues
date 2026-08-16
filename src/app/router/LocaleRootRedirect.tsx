import { Navigate, useLocation, useParams } from 'react-router';
import { buildLocalePath, isSupportedLocale } from '@/shared/i18n/localePath';
import { NotFoundRoute } from '@/app/errors/NotFoundRoute';

// `/es` is a valid locale missing its segment, so it completes to `/es/leagues`
// carrying the query string. `/fr` is not a locale at all and stays a 404.
export function LocaleRootRedirect() {
  const { locale } = useParams();
  const { search } = useLocation();

  if (!isSupportedLocale(locale)) {
    return <NotFoundRoute />;
  }

  return <Navigate to={`${buildLocalePath(locale)}${search}`} replace />;
}
