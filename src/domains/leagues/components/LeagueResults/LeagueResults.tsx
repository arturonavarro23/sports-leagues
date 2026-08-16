import { useTranslation } from 'react-i18next';
import { Button } from '@/design-system/components/Button';
import { EmptyState } from '@/design-system/components/EmptyState';
import { ErrorState } from '@/design-system/components/ErrorState';
import { LeagueGrid } from '@/domains/leagues/components/LeagueGrid';
import type { LeagueResultsProps } from './LeagueResults.types';

export function LeagueResults({
  leagues,
  selectedLeagueId,
  onSelectLeague,
  isLoading,
  isError,
  onRetry,
  viewMode,
  renderBadge,
}: LeagueResultsProps) {
  const { t } = useTranslation();

  if (isError) {
    return (
      <ErrorState
        headingLevel={2}
        title={t('leagues.error.title')}
        description={t('leagues.error.description')}
        action={<Button onClick={onRetry}>{t('leagues.tryAgain')}</Button>}
      />
    );
  }

  if (!isLoading && leagues.length === 0) {
    return (
      <EmptyState
        headingLevel={2}
        title={t('leagues.empty.title')}
        description={t('leagues.empty.description')}
      />
    );
  }

  return (
    <LeagueGrid
      leagues={leagues}
      selectedLeagueId={selectedLeagueId}
      onSelectLeague={onSelectLeague}
      isLoading={isLoading}
      viewMode={viewMode}
      renderBadge={renderBadge}
    />
  );
}
