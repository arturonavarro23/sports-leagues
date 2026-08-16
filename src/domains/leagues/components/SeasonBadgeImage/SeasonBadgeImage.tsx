import { useTranslation } from 'react-i18next';
import { Skeleton } from '@/design-system/components/Skeleton';
import { ShieldIcon } from '@/design-system/icons';
import {
  BADGE_ASPECT_RATIO,
  BADGE_DIMENSIONS,
} from '@/domains/leagues/constants/badge';
import type { SeasonBadgeImageProps } from './SeasonBadgeImage.types';

export function SeasonBadgeImage({
  badge,
  isLoading,
  isError,
  leagueName,
}: SeasonBadgeImageProps) {
  const { t } = useTranslation();

  function renderBadgeContent() {
    if (isLoading) {
      return (
        <Skeleton
          width={BADGE_DIMENSIONS.width}
          height={BADGE_DIMENSIONS.height}
          radius="card"
        />
      );
    }

    if (isError) {
      return (
        <div className="text-content-secondary flex flex-col items-center gap-1 text-center text-xs">
          <ShieldIcon />
          <span>{t('leagues.badge.error')}</span>
        </div>
      );
    }

    if (badge === null) {
      return (
        <div className="text-content-muted flex flex-col items-center gap-1">
          <ShieldIcon />
          <span className="text-center text-xs">
            {t('leagues.badge.missing')}
          </span>
        </div>
      );
    }

    return (
      <img
        src={badge.badgeUrl}
        alt={t('leagues.badge.alt', {
          league: leagueName,
          season: badge.season,
        })}
        width={BADGE_DIMENSIONS.width}
        height={BADGE_DIMENSIONS.height}
        className="h-full w-full object-contain"
      />
    );
  }

  return (
    <div
      aria-busy={isLoading || undefined}
      className="flex items-center justify-center"
      style={{
        width: BADGE_DIMENSIONS.width,
        height: BADGE_DIMENSIONS.height,
        aspectRatio: BADGE_ASPECT_RATIO,
      }}
    >
      {renderBadgeContent()}
    </div>
  );
}
