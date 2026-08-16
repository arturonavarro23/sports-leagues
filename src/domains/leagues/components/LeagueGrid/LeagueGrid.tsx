import { Skeleton } from '@/design-system/components/Skeleton';
import { LeagueCard } from '../LeagueCard';
import type { LeagueGridProps } from './LeagueGrid.types';
import type { ViewMode } from '@/domains/leagues/stores/leaguePreferencesStore';

const SKELETON_COUNT = 6;

const LAYOUT_CLASSES: Record<ViewMode, string> = {
  grid: 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3',
  list: 'grid grid-cols-1 gap-3',
};

export function LeagueGrid({
  leagues,
  selectedLeagueId,
  onSelectLeague,
  isLoading,
  viewMode = 'grid',
  renderBadge,
}: LeagueGridProps) {
  const layoutClassName = LAYOUT_CLASSES[viewMode];

  if (isLoading) {
    return (
      <ul aria-busy="true" className={layoutClassName}>
        {Array.from({ length: SKELETON_COUNT }, (_, index) => (
          <li key={index}>
            <Skeleton height={160} radius="card" className="w-full" />
          </li>
        ))}
      </ul>
    );
  }

  if (leagues.length === 0) {
    return null;
  }

  return (
    <ul className={layoutClassName}>
      {leagues.map((league) => (
        <li key={league.id}>
          <LeagueCard
            league={league}
            isSelected={league.id === selectedLeagueId}
            onSelect={onSelectLeague}
            layout={viewMode === 'list' ? 'row' : 'card'}
            headingLevel={2}
            badgeSlot={
              league.id === selectedLeagueId && renderBadge
                ? renderBadge(league)
                : undefined
            }
          />
        </li>
      ))}
    </ul>
  );
}
