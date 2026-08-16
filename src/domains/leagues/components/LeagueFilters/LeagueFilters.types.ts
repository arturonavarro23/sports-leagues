import type { ReactNode } from 'react';
import type { SportOption } from '@/domains/leagues/models';

export interface LeagueFiltersProps {
  /** Rendered on the result-count row, aligned to the trailing edge. */
  trailingControl?: ReactNode;
  searchValue: string;
  onSearchChange: (value: string) => void;
  sportValue: string;
  sportOptions: SportOption[];
  onSportChange: (value: string) => void;
  resultCount: number;
}
