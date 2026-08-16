import { Link, isRouteErrorResponse, useRouteError } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ROUTE_PATHS } from '@/shared/constants/routes';

export function RouteErrorElement() {
  const { t } = useTranslation();
  const error = useRouteError();
  const hasNoRouteError = error === null || error === undefined;
  const isNotFound =
    hasNoRouteError || (isRouteErrorResponse(error) && error.status === 404);

  const title = isNotFound ? t('notFound.title') : t('errors.unexpectedTitle');

  function getDescription(): string {
    if (isNotFound) return t('notFound.description');
    if (error instanceof Error) return error.message;
    return t('errors.unexpectedMessage');
  }

  const description = getDescription();

  return (
    <main
      id="main-content"
      className="flex min-h-screen flex-col items-center justify-center p-8"
    >
      <div
        role="alert"
        className="flex flex-col items-center gap-4 text-center"
      >
        <h1>{title}</h1>
        <p>{description}</p>
        <Link to={ROUTE_PATHS.leagues}>{t('notFound.backToLeagues')}</Link>
      </div>
    </main>
  );
}
