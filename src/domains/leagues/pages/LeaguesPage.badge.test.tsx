import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { createTestQueryClient } from '@/shared/test/renderWithProviders';
import { createAppQueryClient } from '@/app/providers/queryClient';
import { ROUTE_SEGMENTS } from '@/shared/constants/locales';
import { LEAGUE_ID_WITH_BADGE_ERROR } from '@/mocks/leagueFixtures';
import LeaguesPage from './LeaguesPage';

function renderPage(search: string, client = createTestQueryClient()) {
  const router = createMemoryRouter(
    [{ path: `/:locale/${ROUTE_SEGMENTS.leagues}`, element: <LeaguesPage /> }],
    { initialEntries: [`/en/${ROUTE_SEGMENTS.leagues}${search}`] },
  );

  render(
    <QueryClientProvider client={client}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
}

describe('LeaguesPage badge states', () => {
  it('shows the error fallback when the badge request fails', async () => {
    renderPage(`?league=${LEAGUE_ID_WITH_BADGE_ERROR}`);

    expect(
      await screen.findByText(/could not load badge/i, undefined, {
        timeout: 5000,
      }),
    ).toBeInTheDocument();
  });

  it('still reaches the error fallback with production retry settings', async () => {
    renderPage(`?league=${LEAGUE_ID_WITH_BADGE_ERROR}`, createAppQueryClient());

    expect(
      await screen.findByText(/could not load badge/i, undefined, {
        timeout: 8000,
      }),
    ).toBeInTheDocument();
  });

  it('shows the missing fallback when the league genuinely has no badge', async () => {
    renderPage('?league=4329');

    expect(
      await screen.findByText(/no badge/i, undefined, { timeout: 5000 }),
    ).toBeInTheDocument();
  });
});
