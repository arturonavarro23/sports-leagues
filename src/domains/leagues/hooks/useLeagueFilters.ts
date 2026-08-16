import { useCallback } from 'react';
import { useSearchParams } from 'react-router';
import { ALL_SPORTS_VALUE, LEAGUE_SEARCH_PARAMS } from '../constants/filters';

export interface UseLeagueFiltersResult {
  search: string;
  sport: string;
  selectedLeagueId: string | null;
  setSearch: (value: string) => void;
  setSport: (value: string) => void;
  clearFilters: () => void;
}

function setOrDelete(params: URLSearchParams, key: string, value: string) {
  if (value) {
    params.set(key, value);
  } else {
    params.delete(key);
  }
}

export function useLeagueFilters(): UseLeagueFiltersResult {
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get(LEAGUE_SEARCH_PARAMS.query) ?? '';
  const sport =
    searchParams.get(LEAGUE_SEARCH_PARAMS.sport) ?? ALL_SPORTS_VALUE;
  const selectedLeagueId = searchParams.get(
    LEAGUE_SEARCH_PARAMS.selectedLeague,
  );

  const setSearch = useCallback(
    (value: string) => {
      setSearchParams(
        (previous) => {
          const next = new URLSearchParams(previous);
          setOrDelete(next, LEAGUE_SEARCH_PARAMS.query, value);
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const setSport = useCallback(
    (value: string) => {
      setSearchParams((previous) => {
        const next = new URLSearchParams(previous);
        setOrDelete(
          next,
          LEAGUE_SEARCH_PARAMS.sport,
          value === ALL_SPORTS_VALUE ? '' : value,
        );
        next.delete(LEAGUE_SEARCH_PARAMS.selectedLeague);
        return next;
      });
    },
    [setSearchParams],
  );

  const clearFilters = useCallback(() => {
    setSearchParams((previous) => {
      const next = new URLSearchParams(previous);
      next.delete(LEAGUE_SEARCH_PARAMS.query);
      next.delete(LEAGUE_SEARCH_PARAMS.sport);
      next.delete(LEAGUE_SEARCH_PARAMS.selectedLeague);
      return next;
    });
  }, [setSearchParams]);

  return {
    search,
    sport,
    selectedLeagueId,
    setSearch,
    setSport,
    clearFilters,
  };
}

export interface UseSelectedLeagueParamResult {
  selectedLeagueId: string | null;
  setSelectedLeagueId: (value: string | null) => void;
}

// Exposes the raw `league` param so useLeagueSelection can build on it without
// ever importing useSearchParams or the param names itself.
export function useSelectedLeagueParam(): UseSelectedLeagueParamResult {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedLeagueId = searchParams.get(
    LEAGUE_SEARCH_PARAMS.selectedLeague,
  );

  const setSelectedLeagueId = useCallback(
    (value: string | null) => {
      setSearchParams((previous) => {
        const next = new URLSearchParams(previous);
        setOrDelete(next, LEAGUE_SEARCH_PARAMS.selectedLeague, value ?? '');
        return next;
      });
    },
    [setSearchParams],
  );

  return { selectedLeagueId, setSelectedLeagueId };
}
