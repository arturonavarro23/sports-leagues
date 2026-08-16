import type { ReactNode } from 'react';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { Button } from '@/design-system/components/Button/Button';

interface QueryErrorFallbackProps extends FallbackProps {
  title: string;
}

function QueryErrorFallback({
  error,
  resetErrorBoundary,
  title,
}: QueryErrorFallbackProps) {
  const { t } = useTranslation();
  const errorMessage =
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
        <h1>{title}</h1>
        <p>{errorMessage}</p>
        <Button onClick={resetErrorBoundary}>{t('errors.tryAgain')}</Button>
      </div>
    </main>
  );
}

interface QueryErrorBoundaryProps {
  children: ReactNode;
  fallbackTitle?: string;
}

export function QueryErrorBoundary({
  children,
  fallbackTitle = 'Unable to load data',
}: QueryErrorBoundaryProps) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallbackRender={(fallbackProps) => (
            <QueryErrorFallback {...fallbackProps} title={fallbackTitle} />
          )}
        >
          {children}
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
