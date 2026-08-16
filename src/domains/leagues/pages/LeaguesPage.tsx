import { useMemo, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/design-system/components/Button';
import { EmptyState } from '@/design-system/components/EmptyState';
import { ErrorState } from '@/design-system/components/ErrorState';
import { LeagueFilters } from '@/domains/leagues/components/LeagueFilters';
import { LeagueGrid } from '@/domains/leagues/components/LeagueGrid';
import { SeasonBadgeImage } from '@/domains/leagues/components/SeasonBadgeImage';
import { SEARCH_DEBOUNCE_MS } from '@/domains/leagues/constants/filters';
import { useDebouncedValue } from '@/domains/leagues/hooks/useDebouncedValue';
import { useFilteredLeagues } from '@/domains/leagues/hooks/useFilteredLeagues';
import { useLeagueFilters } from '@/domains/leagues/hooks/useLeagueFilters';
import { useLeagueSelection } from '@/domains/leagues/hooks/useLeagueSelection';
import { useSportOptions } from '@/domains/leagues/hooks/useSportOptions';
import { useLeagueDetailQuery } from '@/domains/leagues/queries/useLeagueDetailQuery';
import { useLeaguesQuery } from '@/domains/leagues/queries/useLeaguesQuery';
import { useSeasonBadgeQuery } from '@/domains/leagues/queries/useSeasonBadgeQuery';
import { ViewModeToggle } from '@/domains/leagues/components/ViewModeToggle';
import { useLeaguePreferencesStore } from '@/domains/leagues/stores/leaguePreferencesStore';
import type { League } from '@/domains/leagues/models';

interface LeaguesPageProps {
  // Filled by the app layer so the domain never imports app-level controls.
  headerActions?: ReactNode;
}

export default function LeaguesPage({ headerActions }: LeaguesPageProps) {
  const { t } = useTranslation();
  const leaguesQuery = useLeaguesQuery();
  const { search, sport, setSearch, setSport } = useLeagueFilters();
  const { selectedLeagueId, selectLeague } = useLeagueSelection();

  const debouncedSearch = useDebouncedValue(search, SEARCH_DEBOUNCE_MS);

  const viewMode = useLeaguePreferencesStore((state) => state.viewMode);
  const setViewMode = useLeaguePreferencesStore((state) => state.setViewMode);

  const badgeQuery = useSeasonBadgeQuery(selectedLeagueId);
  const detailQuery = useLeagueDetailQuery(selectedLeagueId);

  // The list endpoint no longer returns alternate names, so the selected
  // league's card is enriched from the detail lookup. See ADR 0002.
  const enrichedLeagues = useMemo<League[]>(() => {
    const leagues = leaguesQuery.data ?? [];
    const detail = detailQuery.data;
    if (!detail || detail.alternateNames.length === 0) return leagues;

    return leagues.map((league) =>
      league.id === detail.id
        ? { ...league, alternateNames: detail.alternateNames }
        : league,
    );
  }, [leaguesQuery.data, detailQuery.data]);

  const sportOptions = useSportOptions(enrichedLeagues);
  const filteredLeagues = useFilteredLeagues(enrichedLeagues, {
    search: debouncedSearch,
    sport,
  });

  const selectedLeague = filteredLeagues.find(
    (league) => league.id === selectedLeagueId,
  );

  const hasNoResults =
    !leaguesQuery.isPending &&
    !leaguesQuery.isError &&
    filteredLeagues.length === 0;

  function renderResults() {
    if (leaguesQuery.isError) {
      return (
        <ErrorState
          headingLevel={2}
          title={t('leagues.error.title')}
          description={t('leagues.error.description')}
          action={
            <Button onClick={() => void leaguesQuery.refetch()}>
              {t('leagues.tryAgain')}
            </Button>
          }
        />
      );
    }

    if (hasNoResults) {
      return (
        <EmptyState
          headingLevel={2}
          title={t('leagues.empty.title')}
          description={t('leagues.empty.description')}
        />
      );
    }

    return (
      <LeagueGrid
        leagues={filteredLeagues}
        selectedLeagueId={selectedLeagueId}
        onSelectLeague={selectLeague}
        isLoading={leaguesQuery.isPending}
        viewMode={viewMode}
        renderBadge={(league) => {
          if (league.id !== selectedLeague?.id) return null;

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
    );
  }

  return (
    <div className="min-h-dvh">
      <header className="border-border-subtle bg-surface-sunken border-b">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-content-primary text-xl font-semibold">
              {t('leagues.title')}
            </h1>
            <p className="text-content-secondary text-sm">
              {t('leagues.subtitle')}
            </p>
          </div>
          {headerActions}
        </div>
      </header>

      <main id="main-content" className="mx-auto max-w-6xl px-4 py-6">
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

        <div className="mt-6">{renderResults()}</div>
      </main>
    </div>
  );
}
