import { RouterProvider } from 'react-router';
import { useTranslation } from 'react-i18next';
import '@/shared/i18n/i18n';
import { AppErrorBoundary } from '@/app/errors/AppErrorBoundary';
import { QueryProvider } from '@/app/providers/QueryProvider';
import { router } from '@/app/router/router';
import { useAppTheme } from '@/app/theme';

export function App() {
  const { t } = useTranslation();
  useAppTheme();

  return (
    <AppErrorBoundary>
      <QueryProvider>
        <a
          href="#main-content"
          className="focus:rounded-control focus:bg-surface-raised sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2"
        >
          {t('app.skipToMainContent')}
        </a>
        <RouterProvider router={router} />
      </QueryProvider>
    </AppErrorBoundary>
  );
}
