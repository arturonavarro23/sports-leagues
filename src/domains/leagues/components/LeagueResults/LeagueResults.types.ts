import type { ReactNode } from 'react';
import type { League } from '@/domains/leagues/models';
import type { ViewMode } from '@/domains/leagues/stores/leaguePreferencesStore';

export interface LeagueResultsProps {
  leagues: League[];
  selectedLeagueId: string | null;
  onSelectLeague: (leagueId: string) => void;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  viewMode?: ViewMode;
  renderBadge?: (league: League) => ReactNode;
}
