import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { expectNoAxeViolations } from '@/shared/test/a11y';
import { ROUTE_PATHS } from '@/shared/constants/routes';
import { NotFoundRoute } from './NotFoundRoute';

function renderNotFound() {
  const router = createMemoryRouter(
    [{ path: '*', element: <NotFoundRoute /> }],
    { initialEntries: ['/unknown-path'] },
  );

  return render(<RouterProvider router={router} />);
}

describe('NotFoundRoute', () => {
  it('tells the reader the page does not exist', () => {
    renderNotFound();

    expect(
      screen.getByRole('heading', { name: /page not found/i }),
    ).toBeInTheDocument();
  });

  it('is not announced as an error, because nothing failed', () => {
    renderNotFound();

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('offers a way back to the leagues', () => {
    renderNotFound();

    expect(
      screen.getByRole('link', { name: /back to leagues/i }),
    ).toHaveAttribute('href', ROUTE_PATHS.leagues);
  });

  it('has no accessibility violations', async () => {
    const { container } = renderNotFound();

    await expectNoAxeViolations(container);
  });
});
