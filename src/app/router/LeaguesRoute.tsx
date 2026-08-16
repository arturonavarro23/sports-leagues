import { Suspense, lazy } from 'react';
import { useTranslation } from 'react-i18next';
import { Skeleton } from '@/design-system/components/Skeleton';
import { QueryErrorBoundary } from '@/app/errors/QueryErrorBoundary';

const LeaguesPage = lazy(() => import('@/domains/leagues/pages/LeaguesPage'));

const SKELETON_CARD_COUNT = 6;

// Only covers what the lazy chunk brings in: the header lives in AppLayout and
// is already on screen, so it never flashes a placeholder.
function LeaguesContentFallback() {
  return (
    <div aria-busy="true">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <Skeleton height={72} className="w-full" />
          </div>
          <div className="sm:w-56">
            <Skeleton height={72} className="w-full" />
          </div>
        </div>
        <Skeleton height={20} width={140} />
      </div>

      <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: SKELETON_CARD_COUNT }, (_, index) => (
          <li key={index}>
            <Skeleton height={160} radius="card" className="w-full" />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function LeaguesRoute() {
  const { t } = useTranslation();

  return (
    <QueryErrorBoundary fallbackTitle={t('errors.unableToLoadLeagues')}>
      <Suspense fallback={<LeaguesContentFallback />}>
        <LeaguesPage />
      </Suspense>
    </QueryErrorBoundary>
  );
}
