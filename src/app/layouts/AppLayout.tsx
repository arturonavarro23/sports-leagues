import { Outlet } from 'react-router';
import { useTranslation } from 'react-i18next';
import { AppSettings } from '@/app/components/AppSettings';

// The header renders immediately and stays mounted across navigations, so the
// route's Suspense fallback only ever covers the content below it.
export function AppLayout() {
  const { t } = useTranslation();

  return (
    <div className="min-h-dvh">
      <header className="border-border-subtle bg-surface-sunken border-b">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-content-primary text-xl font-semibold">
              {t('leagues.title')}
            </h1>
            <p className="text-content-secondary text-sm">
              {t('leagues.subtitle')}
            </p>
          </div>
          <AppSettings />
        </div>
      </header>

      <main id="main-content" className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
