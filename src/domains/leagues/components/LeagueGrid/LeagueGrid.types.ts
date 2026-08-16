import type { ReactNode } from 'react';
import type { League } from '@/domains/leagues/models';
import type { ViewMode } from '@/domains/leagues/stores/leaguePreferencesStore';

export interface LeagueGridProps {
  leagues: League[];
  selectedLeagueId: string | null;
  onSelectLeague: (leagueId: string) => void;
  isLoading: boolean;
  viewMode?: ViewMode;
  renderBadge?: (league: League) => ReactNode;
}
