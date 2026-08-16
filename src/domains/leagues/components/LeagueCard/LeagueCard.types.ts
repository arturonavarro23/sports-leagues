import type { ReactNode } from 'react';
import type { League } from '@/domains/leagues/models';

export type LeagueCardHeadingLevel = 2 | 3 | 4;

/** `row` is the denser layout, so list view differs from grid at every width. */
export type LeagueCardLayout = 'card' | 'row';

export interface LeagueCardProps {
  league: League;
  isSelected: boolean;
  onSelect: (leagueId: string) => void;
  badgeSlot?: ReactNode;
  headingLevel?: LeagueCardHeadingLevel;
  layout?: LeagueCardLayout;
}
