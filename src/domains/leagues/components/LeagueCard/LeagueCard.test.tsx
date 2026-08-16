import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '@/shared/test/a11y';
import type { League } from '@/domains/leagues/models';
import { LeagueCard } from './LeagueCard';

const league: League = {
  id: 'league-1',
  name: 'English Premier League',
  sport: 'Soccer',
  alternateNames: ['EPL', 'Premier League'],
};

const leagueWithoutAlternateNames: League = {
  id: 'league-2',
  name: 'National Hockey League',
  sport: 'Ice Hockey',
  alternateNames: [],
};

describe('LeagueCard', () => {
  it('renders the league name, sport, and alternate names', () => {
    render(
      <LeagueCard league={league} isSelected={false} onSelect={vi.fn()} />,
    );

    expect(
      screen.getByRole('heading', { name: league.name }),
    ).toBeInTheDocument();
    expect(screen.getByText(league.sport)).toBeInTheDocument();
    expect(
      screen.getByText(/also known as: epl, premier league/i),
    ).toBeInTheDocument();
  });

  it('renders no alternate names row when the array is empty', () => {
    render(
      <LeagueCard
        league={leagueWithoutAlternateNames}
        isSelected={false}
        onSelect={vi.fn()}
      />,
    );

    expect(screen.queryByText(/also known as/i)).not.toBeInTheDocument();
  });

  it('wraps long league and alternate names instead of overflowing', () => {
    const longAlternateName =
      'The Extraordinarily Long Alternate Name for This Particular League That Keeps Going';
    const longLeague: League = {
      id: 'league-3',
      name: 'The International Championship of Extremely Competitive Amateur Sporting Federations',
      sport: 'Multi-sport',
      alternateNames: [longAlternateName],
    };

    render(
      <LeagueCard league={longLeague} isSelected={false} onSelect={vi.fn()} />,
    );

    expect(
      screen.getByRole('heading', { name: longLeague.name }),
    ).toBeInTheDocument();
    expect(screen.getByText(new RegExp(longAlternateName))).toBeInTheDocument();
  });

  it('renders as a real button', () => {
    render(
      <LeagueCard league={league} isSelected={false} onSelect={vi.fn()} />,
    );

    expect(
      screen.getByRole('button', { name: new RegExp(league.name) }),
    ).toBeInTheDocument();
  });

  it('never uses a positive tabIndex', () => {
    const { container } = render(
      <LeagueCard league={league} isSelected={false} onSelect={vi.fn()} />,
    );

    container.querySelectorAll('[tabindex]').forEach((element) => {
      expect(Number(element.getAttribute('tabindex'))).toBeLessThanOrEqual(0);
    });
  });

  it('calls onSelect with the league id when clicked', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <LeagueCard league={league} isSelected={false} onSelect={onSelect} />,
    );

    await user.click(
      screen.getByRole('button', { name: new RegExp(league.name) }),
    );

    expect(onSelect).toHaveBeenCalledWith(league.id);
  });

  it('calls onSelect via keyboard Enter and Space', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <LeagueCard league={league} isSelected={false} onSelect={onSelect} />,
    );

    await user.tab();
    expect(
      screen.getByRole('button', { name: new RegExp(league.name) }),
    ).toHaveFocus();

    await user.keyboard('{Enter}');
    expect(onSelect).toHaveBeenCalledTimes(1);

    await user.keyboard(' ');
    expect(onSelect).toHaveBeenCalledTimes(2);
  });

  it('reflects the selected state via aria-pressed', () => {
    const { rerender } = render(
      <LeagueCard league={league} isSelected={false} onSelect={vi.fn()} />,
    );

    expect(
      screen.getByRole('button', { name: new RegExp(league.name) }),
    ).toHaveAttribute('aria-pressed', 'false');

    rerender(<LeagueCard league={league} isSelected onSelect={vi.fn()} />);

    expect(
      screen.getByRole('button', { name: new RegExp(league.name) }),
    ).toHaveAttribute('aria-pressed', 'true');
  });

  it('marks the surface as selected so the ring is not the only signal', () => {
    render(<LeagueCard league={league} isSelected onSelect={vi.fn()} />);

    expect(screen.getByRole('article')).toHaveAttribute('data-selected');
  });

  it('leaves the surface unmarked when not selected', () => {
    render(
      <LeagueCard league={league} isSelected={false} onSelect={vi.fn()} />,
    );

    expect(screen.getByRole('article')).not.toHaveAttribute('data-selected');
  });

  it('renders the provided badgeSlot content', () => {
    render(
      <LeagueCard
        league={league}
        isSelected
        onSelect={vi.fn()}
        badgeSlot={<span>Badge content</span>}
      />,
    );

    expect(screen.getByText('Badge content')).toBeInTheDocument();
  });

  it('renders the league name at the requested heading level', () => {
    render(
      <LeagueCard
        league={league}
        isSelected={false}
        onSelect={vi.fn()}
        headingLevel={2}
      />,
    );

    expect(
      screen.getByRole('heading', { level: 2, name: league.name }),
    ).toBeInTheDocument();
  });

  it('defaults to a level 3 heading', () => {
    render(
      <LeagueCard league={league} isSelected={false} onSelect={vi.fn()} />,
    );

    expect(
      screen.getByRole('heading', { level: 3, name: league.name }),
    ).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <LeagueCard league={league} isSelected={false} onSelect={vi.fn()} />,
    );
    await expectNoAxeViolations(container);
  });

  it('has no accessibility violations when selected', async () => {
    const { container } = render(
      <LeagueCard league={league} isSelected onSelect={vi.fn()} />,
    );
    await expectNoAxeViolations(container);
  });
});
