import type { SeasonBadge } from '@/domains/leagues/models';

export interface SeasonBadgeImageProps {
  badge: SeasonBadge | null;
  isLoading: boolean;
  isError: boolean;
  leagueName: string;
}
