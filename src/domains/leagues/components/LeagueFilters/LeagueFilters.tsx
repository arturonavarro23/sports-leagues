import { useTranslation } from 'react-i18next';
import { Input } from '@/design-system/components/Input';
import { Select } from '@/design-system/components/Select';
import type { LeagueFiltersProps } from './LeagueFilters.types';

export function LeagueFilters({
  searchValue,
  onSearchChange,
  sportValue,
  sportOptions,
  onSportChange,
  resultCount,
  trailingControl,
}: LeagueFiltersProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <Input
            type="search"
            label={t('leagues.searchLabel')}
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </div>
        <div className="sm:w-56">
          <Select
            label={t('leagues.sportLabel')}
            options={sportOptions}
            value={sportValue}
            onChange={(event) => onSportChange(event.target.value)}
          />
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p aria-live="polite" className="text-content-secondary text-sm">
          {t('leagues.resultCount', { count: resultCount })}
        </p>
        {trailingControl}
      </div>
    </div>
  );
}
