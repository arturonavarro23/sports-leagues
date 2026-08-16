import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { createTestQueryClient } from '@/shared/test/renderWithProviders';
import { routeConfig } from './router';

function renderRouter(initialEntries: string[]) {
  const router = createMemoryRouter(routeConfig, { initialEntries });
  const queryClient = createTestQueryClient();

  render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );

  return router;
}

describe('routeConfig', () => {
  it('redirects the root path to a locale-prefixed leagues route', async () => {
    const router = renderRouter(['/']);

    expect(
      await screen.findByRole('heading', { name: 'Sports Leagues' }),
    ).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/en/leagues');
  });

  it('renders the not-found fallback for an unknown route', async () => {
    renderRouter(['/does-not-exist']);

    expect(
      await screen.findByRole('heading', { name: /page not found/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('redirects the bare /leagues path to a locale-prefixed route', async () => {
    const router = renderRouter(['/leagues']);

    expect(
      await screen.findByRole('heading', { name: 'Sports Leagues' }),
    ).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/en/leagues');
  });

  it('renders the leagues page at /en/leagues', async () => {
    renderRouter(['/en/leagues']);

    expect(
      await screen.findByRole('heading', { name: 'Sports Leagues' }),
    ).toBeInTheDocument();
  });
});
