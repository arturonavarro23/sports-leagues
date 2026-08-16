import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ROUTE_PATHS } from '@/shared/constants/routes';

interface RouteMessageProps {
  title: string;
  description: string;
  /** Only a real failure is an alert; an unknown URL is not. */
  isAlert?: boolean;
}

export function RouteMessage({
  title,
  description,
  isAlert = false,
}: RouteMessageProps) {
  const { t } = useTranslation();

  return (
    <main
      id="main-content"
      className="flex min-h-screen flex-col items-center justify-center p-8"
    >
      <div
        role={isAlert ? 'alert' : undefined}
        className="flex flex-col items-center gap-4 text-center"
      >
        <h1>{title}</h1>
        <p>{description}</p>
        <Link to={ROUTE_PATHS.leagues}>{t('notFound.backToLeagues')}</Link>
      </div>
    </main>
  );
}
