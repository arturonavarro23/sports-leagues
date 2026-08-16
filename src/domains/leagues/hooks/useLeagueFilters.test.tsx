import { act } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithProviders } from '@/shared/test/renderWithProviders';
import { ALL_SPORTS_VALUE } from '../constants/filters';
import { useLeagueFilters } from './useLeagueFilters';

type Filters = ReturnType<typeof useLeagueFilters>;

function FiltersProbe({ onChange }: { onChange: (filters: Filters) => void }) {
  const filters = useLeagueFilters();
  onChange(filters);
  return null;
}

function renderFilters(initialEntries: string[]) {
  let latest!: Filters;
  const { router } = renderWithProviders(
    <FiltersProbe onChange={(filters) => (latest = filters)} />,
    { initialEntries },
  );

  return {
    router,
    getFilters: () => latest,
  };
}

describe('useLeagueFilters', () => {
  it('initializes state from the URL', () => {
    const { getFilters } = renderFilters([
      '/leagues?search=premier&sport=Soccer&league=4328',
    ]);

    expect(getFilters().search).toBe('premier');
    expect(getFilters().sport).toBe('Soccer');
    expect(getFilters().selectedLeagueId).toBe('4328');
  });

  it('defaults sport to ALL_SPORTS_VALUE and selectedLeagueId to null when unset', () => {
    const { getFilters } = renderFilters(['/leagues']);

    expect(getFilters().search).toBe('');
    expect(getFilters().sport).toBe(ALL_SPORTS_VALUE);
    expect(getFilters().selectedLeagueId).toBeNull();
  });

  it('updates the search param with replace navigation', () => {
    const { router, getFilters } = renderFilters(['/leagues?search=old']);

    act(() => {
      getFilters().setSearch('nba');
    });

    expect(router.state.location.search).toBe('?search=nba');
    expect(router.state.location.pathname).toBe('/leagues');
    expect(router.state.historyAction).toBe('REPLACE');
  });

  it('removes the search param instead of leaving it empty', () => {
    const { router, getFilters } = renderFilters([
      '/leagues?search=old&sport=Soccer',
    ]);

    act(() => {
      getFilters().setSearch('');
    });

    expect(router.state.location.search).toBe('?sport=Soccer');
  });

  it('updates the sport param with push navigation', () => {
    const { router, getFilters } = renderFilters(['/leagues']);

    act(() => {
      getFilters().setSport('Soccer');
    });

    expect(router.state.location.search).toBe('?sport=Soccer');
    expect(router.state.historyAction).toBe('PUSH');
  });

  it('removes the sport param when set back to ALL_SPORTS_VALUE', () => {
    const { router, getFilters } = renderFilters(['/leagues?sport=Soccer']);

    act(() => {
      getFilters().setSport(ALL_SPORTS_VALUE);
    });

    expect(router.state.location.search).toBe('');
  });

  it('clears the selected league when the sport changes', () => {
    const { router, getFilters } = renderFilters([
      '/leagues?sport=Soccer&league=4328',
    ]);

    act(() => {
      getFilters().setSport('Basketball');
    });

    expect(router.state.location.search).toBe('?sport=Basketball');
    expect(getFilters().selectedLeagueId).toBeNull();
  });

  it('preserves unrelated params already present in the URL', () => {
    const { router, getFilters } = renderFilters(['/leagues?debug=true']);

    act(() => {
      getFilters().setSearch('nba');
    });

    const params = new URLSearchParams(router.state.location.search);
    expect(params.get('debug')).toBe('true');
    expect(params.get('search')).toBe('nba');
  });

  it('clearFilters removes search, sport and selectedLeague params', () => {
    const { router, getFilters } = renderFilters([
      '/leagues?search=nba&sport=Basketball&league=4387&debug=true',
    ]);

    act(() => {
      getFilters().clearFilters();
    });

    const params = new URLSearchParams(router.state.location.search);
    expect(params.get('search')).toBeNull();
    expect(params.get('sport')).toBeNull();
    expect(params.get('league')).toBeNull();
    expect(params.get('debug')).toBe('true');
  });

  it('restores previous filter state on back/forward navigation', async () => {
    const { router, getFilters } = renderFilters(['/leagues']);

    act(() => {
      getFilters().setSport('Soccer');
    });
    act(() => {
      getFilters().setSport('Basketball');
    });
    expect(getFilters().sport).toBe('Basketball');

    await act(async () => {
      await router.navigate(-1);
    });
    expect(getFilters().sport).toBe('Soccer');

    await act(async () => {
      await router.navigate(-1);
    });
    expect(getFilters().sport).toBe(ALL_SPORTS_VALUE);

    await act(async () => {
      await router.navigate(1);
    });
    expect(getFilters().sport).toBe('Soccer');
  });
});
