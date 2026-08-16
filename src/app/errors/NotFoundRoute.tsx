import { useTranslation } from 'react-i18next';
import { RouteMessage } from '@/app/errors/RouteMessage';

// The catch-all element: nothing failed, the URL simply matches no route.
export function NotFoundRoute() {
  const { t } = useTranslation();

  return (
    <RouteMessage
      title={t('notFound.title')}
      description={t('notFound.description')}
    />
  );
}
