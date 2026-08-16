import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';
import { Button } from '@/design-system/components/Button/Button';

function AppErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  const { t } = useTranslation();
  const message =
    error instanceof Error ? error.message : t('errors.unexpectedMessage');

  return (
    <main
      id="main-content"
      className="flex min-h-screen flex-col items-center justify-center p-8"
    >
      <div
        role="alert"
        className="flex flex-col items-center gap-4 text-center"
      >
        <h1>{t('errors.unexpectedTitle')}</h1>
        <p>{message}</p>
        <Button onClick={resetErrorBoundary}>{t('errors.tryAgain')}</Button>
      </div>
    </main>
  );
}

interface AppErrorBoundaryProps {
  children: ReactNode;
}

export function AppErrorBoundary({ children }: AppErrorBoundaryProps) {
  return (
    <ErrorBoundary FallbackComponent={AppErrorFallback}>
      {children}
    </ErrorBoundary>
  );
}
