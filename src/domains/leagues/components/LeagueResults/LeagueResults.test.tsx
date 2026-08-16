import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LeagueResults } from './LeagueResults';
import type { League } from '@/domains/leagues/models';

const leagues: League[] = [
  { id: '1', name: 'Alpha League', sport: 'Soccer', alternateNames: [] },
];

const baseProps = {
  leagues,
  selectedLeagueId: null,
  onSelectLeague: vi.fn(),
  isLoading: false,
  isError: false,
  onRetry: vi.fn(),
};

describe('LeagueResults', () => {
  it('renders the error state and retries', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    render(<LeagueResults {...baseProps} isError onRetry={onRetry} />);

    expect(screen.getByRole('alert')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /try again/i }));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('renders the empty state when there are no leagues', () => {
    render(<LeagueResults {...baseProps} leagues={[]} />);

    expect(
      screen.getByRole('heading', { name: /no leagues match/i }),
    ).toBeInTheDocument();
  });

  it('does not call an empty result an error', () => {
    render(<LeagueResults {...baseProps} leagues={[]} />);

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('shows the loading grid rather than the empty state while pending', () => {
    render(<LeagueResults {...baseProps} leagues={[]} isLoading />);

    expect(
      screen.queryByRole('heading', { name: /no leagues match/i }),
    ).toBeNull();
    expect(screen.getByRole('list')).toHaveAttribute('aria-busy', 'true');
  });

  it('renders the leagues when there are results', () => {
    render(<LeagueResults {...baseProps} />);

    expect(
      screen.getByRole('heading', { name: 'Alpha League' }),
    ).toBeInTheDocument();
  });

  it('prefers the error state over results', () => {
    render(<LeagueResults {...baseProps} isError />);

    expect(screen.queryByRole('heading', { name: 'Alpha League' })).toBeNull();
  });
});
