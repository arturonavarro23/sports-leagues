import { act } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithProviders } from '@/shared/test/renderWithProviders';
import { useLeagueSelection } from './useLeagueSelection';

type Selection = ReturnType<typeof useLeagueSelection>;

function SelectionProbe({
  onChange,
}: {
  onChange: (selection: Selection) => void;
}) {
  const selection = useLeagueSelection();
  onChange(selection);
  return null;
}

function renderSelection(initialEntries: string[]) {
  let latest!: Selection;
  const { router } = renderWithProviders(
    <SelectionProbe onChange={(selection) => (latest = selection)} />,
    { initialEntries },
  );

  return {
    router,
    getSelection: () => latest,
  };
}

describe('useLeagueSelection', () => {
  it('initializes the selected league from the URL', () => {
    const { getSelection } = renderSelection(['/leagues?league=4328']);
    expect(getSelection().selectedLeagueId).toBe('4328');
    expect(getSelection().isSelected('4328')).toBe(true);
    expect(getSelection().isSelected('9999')).toBe(false);
  });

  it('has no selection when the param is absent', () => {
    const { getSelection } = renderSelection(['/leagues']);
    expect(getSelection().selectedLeagueId).toBeNull();
  });

  it('selects a league with push navigation', () => {
    const { router, getSelection } = renderSelection(['/leagues']);

    act(() => {
      getSelection().selectLeague('4328');
    });

    expect(getSelection().selectedLeagueId).toBe('4328');
    expect(router.state.location.search).toBe('?league=4328');
    expect(router.state.historyAction).toBe('PUSH');
  });

  it('toggles off the already-selected league', () => {
    const { router, getSelection } = renderSelection(['/leagues?league=4328']);

    act(() => {
      getSelection().selectLeague('4328');
    });

    expect(getSelection().selectedLeagueId).toBeNull();
    expect(router.state.location.search).toBe('');
  });

  it('selecting a different league replaces the current selection', () => {
    const { getSelection } = renderSelection(['/leagues?league=4328']);

    act(() => {
      getSelection().selectLeague('4387');
    });

    expect(getSelection().selectedLeagueId).toBe('4387');
  });

  it('clearSelection removes the selected league', () => {
    const { router, getSelection } = renderSelection(['/leagues?league=4328']);

    act(() => {
      getSelection().clearSelection();
    });

    expect(getSelection().selectedLeagueId).toBeNull();
    expect(router.state.location.search).toBe('');
  });

  it('preserves unrelated params when selecting a league', () => {
    const { router, getSelection } = renderSelection(['/leagues?search=nba']);

    act(() => {
      getSelection().selectLeague('4387');
    });

    const params = new URLSearchParams(router.state.location.search);
    expect(params.get('search')).toBe('nba');
    expect(params.get('league')).toBe('4387');
  });

  it('supports back/forward navigation restoring the previous selection', async () => {
    const { router, getSelection } = renderSelection(['/leagues']);

    act(() => {
      getSelection().selectLeague('4328');
    });
    act(() => {
      getSelection().selectLeague('4387');
    });
    expect(getSelection().selectedLeagueId).toBe('4387');

    await act(async () => {
      await router.navigate(-1);
    });
    expect(getSelection().selectedLeagueId).toBe('4328');

    await act(async () => {
      await router.navigate(1);
    });
    expect(getSelection().selectedLeagueId).toBe('4387');
  });
});
