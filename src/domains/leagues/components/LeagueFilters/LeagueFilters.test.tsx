import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '@/shared/test/a11y';
import { LeagueFilters } from './LeagueFilters';
import type { LeagueFiltersProps } from './LeagueFilters.types';

function ControlledSearch(
  props: Omit<LeagueFiltersProps, 'searchValue' | 'onSearchChange'> & {
    onSearchChange: (value: string) => void;
  },
) {
  const [searchValue, setSearchValue] = useState('');

  return (
    <LeagueFilters
      {...props}
      searchValue={searchValue}
      onSearchChange={(value) => {
        setSearchValue(value);
        props.onSearchChange(value);
      }}
    />
  );
}

const sportOptions = [
  { value: '', label: 'All sports' },
  { value: 'Soccer', label: 'Soccer' },
  { value: 'Ice Hockey', label: 'Ice Hockey' },
];

describe('LeagueFilters', () => {
  it('renders the search input with its current value', () => {
    render(
      <LeagueFilters
        searchValue="premier"
        onSearchChange={vi.fn()}
        sportValue=""
        sportOptions={sportOptions}
        onSportChange={vi.fn()}
        resultCount={3}
      />,
    );

    expect(screen.getByRole('searchbox')).toHaveValue('premier');
  });

  it('calls onSearchChange when the search input changes', async () => {
    const user = userEvent.setup();
    const onSearchChange = vi.fn();
    render(
      <ControlledSearch
        sportValue=""
        sportOptions={sportOptions}
        onSportChange={vi.fn()}
        onSearchChange={onSearchChange}
        resultCount={0}
      />,
    );

    await user.type(screen.getByRole('searchbox'), 'nhl');

    expect(onSearchChange).toHaveBeenCalledTimes(3);
    expect(onSearchChange).toHaveBeenLastCalledWith('nhl');
  });

  it('renders the sport select with its current value and options', () => {
    render(
      <LeagueFilters
        searchValue=""
        onSearchChange={vi.fn()}
        sportValue="Soccer"
        sportOptions={sportOptions}
        onSportChange={vi.fn()}
        resultCount={5}
      />,
    );

    expect(screen.getByRole('combobox')).toHaveValue('Soccer');
    expect(
      screen.getByRole('option', { name: 'Ice Hockey' }),
    ).toBeInTheDocument();
  });

  it('calls onSportChange when the sport select changes', async () => {
    const user = userEvent.setup();
    const onSportChange = vi.fn();
    render(
      <LeagueFilters
        searchValue=""
        onSearchChange={vi.fn()}
        sportValue=""
        sportOptions={sportOptions}
        onSportChange={onSportChange}
        resultCount={0}
      />,
    );

    await user.selectOptions(screen.getByRole('combobox'), 'Ice Hockey');

    expect(onSportChange).toHaveBeenCalledWith('Ice Hockey');
  });

  it('announces the result count in a polite live region', () => {
    render(
      <LeagueFilters
        searchValue=""
        onSearchChange={vi.fn()}
        sportValue=""
        sportOptions={sportOptions}
        onSportChange={vi.fn()}
        resultCount={12}
      />,
    );

    const liveRegion = screen.getByText(/12 leagues found/i);
    expect(liveRegion).toHaveAttribute('aria-live', 'polite');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <LeagueFilters
        searchValue=""
        onSearchChange={vi.fn()}
        sportValue=""
        sportOptions={sportOptions}
        onSportChange={vi.fn()}
        resultCount={0}
      />,
    );
    await expectNoAxeViolations(container);
  });
});
