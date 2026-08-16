import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { expectNoAxeViolations } from '@/shared/test/a11y';
import { ROUTE_PATHS } from '@/shared/constants/routes';
import { RouteErrorElement } from './RouteErrorElement';

describe('RouteErrorElement', () => {
  it('renders a not-found message when there is no thrown route error', () => {
    const router = createMemoryRouter(
      [{ path: '*', element: <RouteErrorElement /> }],
      { initialEntries: ['/unknown-path'] },
    );

    render(<RouterProvider router={router} />);

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /page not found/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /back to leagues/i }),
    ).toHaveAttribute('href', ROUTE_PATHS.leagues);
  });

  it('renders an unexpected-error message for a thrown route error', () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    function Bomb(): never {
      throw new Error('Route blew up');
    }

    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: <Bomb />,
          errorElement: <RouteErrorElement />,
        },
      ],
      { initialEntries: ['/'] },
    );

    render(<RouterProvider router={router} />);

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /something went wrong/i }),
    ).toBeInTheDocument();
    expect(screen.getByText('Route blew up')).toBeInTheDocument();

    consoleErrorSpy.mockRestore();
  });

  it('has no axe violations', async () => {
    const router = createMemoryRouter(
      [{ path: '*', element: <RouteErrorElement /> }],
      { initialEntries: ['/unknown-path'] },
    );

    const { container } = render(<RouterProvider router={router} />);

    await expectNoAxeViolations(container);
  });
});
