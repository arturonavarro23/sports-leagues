import { Suspense, lazy } from 'react';
import { useTranslation } from 'react-i18next';
import { Skeleton } from '@/design-system/components/Skeleton';
import { QueryErrorBoundary } from '@/app/errors/QueryErrorBoundary';
import { AppSettings } from '@/app/components/AppSettings';

const LeaguesPage = lazy(() => import('@/domains/leagues/pages/LeaguesPage'));

const SKELETON_CARD_COUNT = 6;

// Mirrors the LeaguesPage shell so swapping the real page in shifts nothing.
function LeaguesRouteFallback() {
  return (
    <div className="min-h-dvh" aria-busy="true">
      <header className="border-border-subtle bg-surface-sunken border-b">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4">
          <Skeleton height={28} width={196} />
          <Skeleton height={20} width={260} />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
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
      </main>
    </div>
  );
}

export function LeaguesRoute() {
  const { t } = useTranslation();

  return (
    <QueryErrorBoundary fallbackTitle={t('errors.unableToLoadLeagues')}>
      <Suspense fallback={<LeaguesRouteFallback />}>
        <LeaguesPage headerActions={<AppSettings />} />
      </Suspense>
    </QueryErrorBoundary>
  );
}
