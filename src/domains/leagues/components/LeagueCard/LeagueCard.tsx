import { useTranslation } from 'react-i18next';
import { Card } from '@/design-system/components/Card';
import { Badge } from '@/design-system/components/Badge';
import { cn } from '@/shared/utils/cn';
import type { LeagueCardProps } from './LeagueCard.types';

type HeadingTag = 'h2' | 'h3' | 'h4';

export function LeagueCard({
  league,
  isSelected,
  onSelect,
  badgeSlot,
  headingLevel = 3,
  layout = 'card',
}: LeagueCardProps) {
  const { t } = useTranslation();
  const Heading: HeadingTag = `h${headingLevel}`;
  const isRow = layout === 'row';

  return (
    <Card as="article" isInteractive isSelected={isSelected} className="p-0">
      <button
        type="button"
        aria-pressed={isSelected}
        onClick={() => onSelect(league.id)}
        className={cn(
          'flex w-full flex-col items-start gap-2 p-4 text-left',
          // The row layout only kicks in from sm up: below that the grid is a
          // single column anyway and the toggle is hidden, so a narrow screen
          // always gets the full card rather than a truncated row.
          isRow && 'sm:flex-row sm:items-center sm:gap-3 sm:py-3',
        )}
      >
        <div
          className={cn('flex min-w-0 flex-col gap-1', isRow && 'sm:flex-1')}
        >
          <Heading className="text-content-primary min-w-0 text-base font-semibold break-words">
            {league.name}
          </Heading>
          {league.alternateNames.length > 0 && (
            <p
              className={cn(
                'text-content-secondary min-w-0 text-sm break-words',
                // Only the wide row truncates; the narrow card keeps it whole.
                isRow && 'sm:truncate',
              )}
            >
              {t('leagues.alsoKnownAs', {
                names: league.alternateNames.join(', '),
              })}
            </p>
          )}
        </div>
        <Badge variant="accent">{league.sport}</Badge>
      </button>
      {badgeSlot && (
        <div
          className={cn(
            'flex px-4 pb-4',
            isRow ? 'justify-start pt-0' : 'justify-center',
          )}
        >
          {badgeSlot}
        </div>
      )}
    </Card>
  );
}
