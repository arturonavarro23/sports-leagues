import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '@/shared/test/a11y';
import type { League } from '@/domains/leagues/models';
import { LeagueGrid } from './LeagueGrid';

const leagues: League[] = [
  {
    id: 'league-1',
    name: 'English Premier League',
    sport: 'Soccer',
    alternateNames: ['EPL'],
  },
  {
    id: 'league-2',
    name: 'National Hockey League',
    sport: 'Ice Hockey',
    alternateNames: [],
  },
];

describe('LeagueGrid', () => {
  it('renders one list item per league', () => {
    render(
      <LeagueGrid
        leagues={leagues}
        selectedLeagueId={null}
        onSelectLeague={vi.fn()}
        isLoading={false}
      />,
    );

    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(leagues.length);
  });

  it('calls onSelectLeague with the clicked league id', async () => {
    const user = userEvent.setup();
    const onSelectLeague = vi.fn();
    render(
      <LeagueGrid
        leagues={leagues}
        selectedLeagueId={null}
        onSelectLeague={onSelectLeague}
        isLoading={false}
      />,
    );

    await user.click(
      screen.getByRole('button', { name: /National Hockey League/ }),
    );

    expect(onSelectLeague).toHaveBeenCalledWith('league-2');
  });

  it('renders skeleton placeholders and marks the list busy while loading', () => {
    const { container } = render(
      <LeagueGrid
        leagues={[]}
        selectedLeagueId={null}
        onSelectLeague={vi.fn()}
        isLoading
      />,
    );

    const list = screen.getByRole('list');
    expect(list).toHaveAttribute('aria-busy', 'true');
    expect(screen.queryAllByRole('button')).toHaveLength(0);
    expect(
      container.querySelectorAll('[aria-hidden="true"]').length,
    ).toBeGreaterThan(0);
  });

  it('renders nothing when there are no leagues and it is not loading', () => {
    const { container } = render(
      <LeagueGrid
        leagues={[]}
        selectedLeagueId={null}
        onSelectLeague={vi.fn()}
        isLoading={false}
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('renders the badge content only for the selected league', () => {
    render(
      <LeagueGrid
        leagues={leagues}
        selectedLeagueId="league-2"
        onSelectLeague={vi.fn()}
        isLoading={false}
        renderBadge={(league) => <span>Badge for {league.name}</span>}
      />,
    );

    expect(
      screen.getByText('Badge for National Hockey League'),
    ).toBeInTheDocument();
    expect(
      screen.queryByText('Badge for English Premier League'),
    ).not.toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <LeagueGrid
        leagues={leagues}
        selectedLeagueId="league-1"
        onSelectLeague={vi.fn()}
        isLoading={false}
      />,
    );
    await expectNoAxeViolations(container);
  });

  it('has no accessibility violations while loading', async () => {
    const { container } = render(
      <LeagueGrid
        leagues={[]}
        selectedLeagueId={null}
        onSelectLeague={vi.fn()}
        isLoading
      />,
    );
    await expectNoAxeViolations(container);
  });
});
