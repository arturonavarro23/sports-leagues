import { Suspense, lazy } from 'react';
import { useTranslation } from 'react-i18next';
import { QueryErrorBoundary } from '@/app/errors/QueryErrorBoundary';
import { LeaguesSkeleton } from '@/domains/leagues/components/LeaguesSkeleton';

const LeaguesPage = lazy(() => import('@/domains/leagues/pages/LeaguesPage'));

export function LeaguesRoute() {
  const { t } = useTranslation();

  return (
    <QueryErrorBoundary fallbackTitle={t('errors.unableToLoadLeagues')}>
      <Suspense fallback={<LeaguesSkeleton />}>
        <LeaguesPage />
      </Suspense>
    </QueryErrorBoundary>
  );
}
