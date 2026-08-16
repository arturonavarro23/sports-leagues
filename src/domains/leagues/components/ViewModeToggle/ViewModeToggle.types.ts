import type { ViewMode } from '@/domains/leagues/stores/leaguePreferencesStore';

export interface ViewModeOption {
  value: ViewMode;
  label: string;
}

export interface ViewModeToggleProps {
  legend: string;
  value: ViewMode;
  options: ViewModeOption[];
  onChange: (value: ViewMode) => void;
}
