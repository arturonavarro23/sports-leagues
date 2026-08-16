import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { LeagueFilters } from '@/domains/leagues/components/LeagueFilters';
import { LeagueResults } from '@/domains/leagues/components/LeagueResults';
import { SeasonBadgeImage } from '@/domains/leagues/components/SeasonBadgeImage';
import { ViewModeToggle } from '@/domains/leagues/components/ViewModeToggle';
import { SEARCH_DEBOUNCE_MS } from '@/domains/leagues/constants/filters';
import { useDebouncedValue } from '@/domains/leagues/hooks/useDebouncedValue';
import { useFilteredLeagues } from '@/domains/leagues/hooks/useFilteredLeagues';
import { useLeagueFilters } from '@/domains/leagues/hooks/useLeagueFilters';
import { useLeagueSelection } from '@/domains/leagues/hooks/useLeagueSelection';
import { useSportOptions } from '@/domains/leagues/hooks/useSportOptions';
import { useLeagueDetailQuery } from '@/domains/leagues/queries/useLeagueDetailQuery';
import { useLeaguesQuery } from '@/domains/leagues/queries/useLeaguesQuery';
import { useSeasonBadgeQuery } from '@/domains/leagues/queries/useSeasonBadgeQuery';
import { useLeaguePreferencesStore } from '@/domains/leagues/stores/leaguePreferencesStore';
import { applyLeagueDetail } from '@/domains/leagues/utils/applyLeagueDetail';

export default function LeaguesPage() {
  const { t } = useTranslation();

  const { search, sport, setSearch, setSport } = useLeagueFilters();
  const { selectedLeagueId, selectLeague } = useLeagueSelection();
  const viewMode = useLeaguePreferencesStore((state) => state.viewMode);
  const setViewMode = useLeaguePreferencesStore((state) => state.setViewMode);

  const leaguesQuery = useLeaguesQuery();
  const badgeQuery = useSeasonBadgeQuery(selectedLeagueId);
  const detailQuery = useLeagueDetailQuery(selectedLeagueId);

  const leagues = useMemo(
    () => applyLeagueDetail(leaguesQuery.data ?? [], detailQuery.data),
    [leaguesQuery.data, detailQuery.data],
  );

  const debouncedSearch = useDebouncedValue(search, SEARCH_DEBOUNCE_MS);
  const sportOptions = useSportOptions(leagues);
  const filteredLeagues = useFilteredLeagues(leagues, {
    search: debouncedSearch,
    sport,
  });

  return (
    <>
      <LeagueFilters
        searchValue={search}
        onSearchChange={setSearch}
        sportValue={sport}
        sportOptions={sportOptions}
        onSportChange={setSport}
        resultCount={filteredLeagues.length}
        trailingControl={
          <ViewModeToggle
            legend={t('viewMode.label')}
            value={viewMode}
            options={[
              { value: 'grid', label: t('viewMode.grid') },
              { value: 'list', label: t('viewMode.list') },
            ]}
            onChange={setViewMode}
          />
        }
      />

      <div className="mt-6">
        <LeagueResults
          leagues={filteredLeagues}
          selectedLeagueId={selectedLeagueId}
          onSelectLeague={selectLeague}
          isLoading={leaguesQuery.isPending}
          isError={leaguesQuery.isError}
          onRetry={() => void leaguesQuery.refetch()}
          viewMode={viewMode}
          renderBadge={(league) => {
            if (league.id !== selectedLeagueId) return null;

            return (
              <SeasonBadgeImage
                leagueName={league.name}
                badge={badgeQuery.data ?? null}
                isLoading={badgeQuery.isFetching}
                isError={badgeQuery.isError}
              />
            );
          }}
        />
      </div>
    </>
  );
}
