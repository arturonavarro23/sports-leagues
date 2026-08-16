import { isRouteErrorResponse, useRouteError } from 'react-router';
import { useTranslation } from 'react-i18next';
import { RouteMessage } from '@/app/errors/RouteMessage';

// Only ever reached when something actually threw: a loader rejecting, or a
// render failing. A 404 thrown by a loader is a missing resource, anything
// else is a fault, and the two are reported differently.
export function RouteErrorElement() {
  const { t } = useTranslation();
  const error = useRouteError();

  if (isRouteErrorResponse(error) && error.status === 404) {
    return (
      <RouteMessage
        title={t('notFound.title')}
        description={t('notFound.description')}
      />
    );
  }

  function getDescription(): string {
    if (isRouteErrorResponse(error))
      return error.statusText || String(error.status);
    if (error instanceof Error) return error.message;
    return t('errors.unexpectedMessage');
  }

  return (
    <RouteMessage
      isAlert
      title={t('errors.unexpectedTitle')}
      description={getDescription()}
    />
  );
}
