import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectNoAxeViolations } from '@/shared/test/a11y';
import { BADGE_DIMENSIONS } from '@/domains/leagues/constants/badge';
import { SeasonBadgeImage } from './SeasonBadgeImage';

const badge = {
  season: '2023-2024',
  badgeUrl: 'https://example.com/badge.png',
};

describe('SeasonBadgeImage', () => {
  it('renders a loading skeleton and marks the container busy while loading', () => {
    const { container } = render(
      <SeasonBadgeImage
        badge={null}
        isLoading
        isError={false}
        leagueName="Premier League"
      />,
    );

    expect(container.querySelector('[aria-busy="true"]')).toBeInTheDocument();
  });

  it('renders a placeholder when the league has no badge', () => {
    render(
      <SeasonBadgeImage
        badge={null}
        isLoading={false}
        isError={false}
        leagueName="Premier League"
      />,
    );

    expect(screen.getByText(/no badge/i)).toBeInTheDocument();
  });

  it('distinguishes a missing badge from a failed request', () => {
    const { unmount } = render(
      <SeasonBadgeImage
        badge={null}
        isLoading={false}
        isError={false}
        leagueName="Premier League"
      />,
    );
    const missingText = screen.getByText(/no badge/i).textContent;
    unmount();

    render(
      <SeasonBadgeImage
        badge={null}
        isLoading={false}
        isError
        leagueName="Premier League"
      />,
    );

    expect(screen.getByText(/could not load badge/i).textContent).not.toBe(
      missingText,
    );
  });

  it('renders no interactive control in any fallback state', () => {
    render(
      <SeasonBadgeImage
        badge={null}
        isLoading={false}
        isError
        leagueName="Premier League"
      />,
    );

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders the badge image with explicit dimensions and contextual alt text on success', () => {
    render(
      <SeasonBadgeImage
        badge={badge}
        isLoading={false}
        isError={false}
        leagueName="Premier League"
      />,
    );

    const image = screen.getByRole('img', {
      name: 'Premier League badge, 2023-2024 season',
    });
    expect(image).toHaveAttribute('src', badge.badgeUrl);
    expect(image).toHaveAttribute('width', String(BADGE_DIMENSIONS.width));
    expect(image).toHaveAttribute('height', String(BADGE_DIMENSIONS.height));
    expect(image).not.toHaveAttribute('loading', 'lazy');
  });

  it('has no accessibility violations in the loading state', async () => {
    const { container } = render(
      <SeasonBadgeImage
        badge={null}
        isLoading
        isError={false}
        leagueName="Premier League"
      />,
    );
    await expectNoAxeViolations(container);
  });

  it('has no accessibility violations in the error state', async () => {
    const { container } = render(
      <SeasonBadgeImage
        badge={null}
        isLoading={false}
        isError
        leagueName="Premier League"
      />,
    );
    await expectNoAxeViolations(container);
  });

  it('has no accessibility violations in the success state', async () => {
    const { container } = render(
      <SeasonBadgeImage
        badge={badge}
        isLoading={false}
        isError={false}
        leagueName="Premier League"
      />,
    );
    await expectNoAxeViolations(container);
  });
});
