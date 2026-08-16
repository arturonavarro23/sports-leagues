import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { expectNoAxeViolations } from '@/shared/test/a11y';
import { LeaguesSkeleton } from './LeaguesSkeleton';

describe('LeaguesSkeleton', () => {
  it('marks the region as busy', () => {
    const { container } = render(<LeaguesSkeleton />);

    expect(container.firstElementChild).toHaveAttribute('aria-busy', 'true');
  });

  it('draws one placeholder per requested card', () => {
    render(<LeaguesSkeleton cardCount={3} />);

    expect(screen.getAllByRole('listitem')).toHaveLength(3);
  });

  it('reserves the same card height the real grid uses', () => {
    render(<LeaguesSkeleton cardCount={1} />);

    const placeholder = screen.getByRole('listitem').firstElementChild;
    expect(placeholder).toHaveStyle({ height: '160px' });
  });

  it('announces nothing beyond the busy state', () => {
    render(<LeaguesSkeleton />);

    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<LeaguesSkeleton />);

    await expectNoAxeViolations(container);
  });
});
