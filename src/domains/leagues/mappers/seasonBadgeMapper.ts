import type { AllSeasonsResponseDto } from '@/domains/leagues/api/leagues.dto';
import type { SeasonBadge } from '@/domains/leagues/models/league';

export function mapFirstAvailableBadge(
  dto: AllSeasonsResponseDto,
): SeasonBadge | null {
  if (!dto.seasons) return null;

  for (const season of dto.seasons) {
    if (season.strSeason && season.strBadge) {
      return { season: season.strSeason, badgeUrl: season.strBadge };
    }
  }

  return null;
}
