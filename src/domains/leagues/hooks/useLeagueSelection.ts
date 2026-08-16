import { useCallback } from 'react';
import { useSelectedLeagueParam } from './useLeagueFilters';

export interface UseLeagueSelectionResult {
  selectedLeagueId: string | null;
  selectLeague: (id: string) => void;
  clearSelection: () => void;
  isSelected: (id: string) => boolean;
}

export function useLeagueSelection(): UseLeagueSelectionResult {
  const { selectedLeagueId, setSelectedLeagueId } = useSelectedLeagueParam();

  const selectLeague = useCallback(
    (id: string) => {
      setSelectedLeagueId(selectedLeagueId === id ? null : id);
    },
    [selectedLeagueId, setSelectedLeagueId],
  );

  const clearSelection = useCallback(() => {
    setSelectedLeagueId(null);
  }, [setSelectedLeagueId]);

  const isSelected = useCallback(
    (id: string) => selectedLeagueId === id,
    [selectedLeagueId],
  );

  return { selectedLeagueId, selectLeague, clearSelection, isSelected };
}
