import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { useLocaleSwitcher } from './useLocaleSwitcher';

function SwitchToSpanishButton() {
  const switchLocale = useLocaleSwitcher();
  return <button onClick={() => switchLocale('es')}>Switch</button>;
}

describe('useLocaleSwitcher', () => {
  it('preserves the full query string when switching locale', async () => {
    const user = userEvent.setup();
    const router = createMemoryRouter(
      [{ path: '/:locale/leagues', element: <SwitchToSpanishButton /> }],
      {
        initialEntries: ['/en/leagues?search=premier&sport=Soccer&league=4328'],
      },
    );

    render(<RouterProvider router={router} />);

    await user.click(screen.getByRole('button', { name: 'Switch' }));

    expect(router.state.location.pathname).toBe('/es/leagues');
    expect(router.state.location.search).toBe(
      '?search=premier&sport=Soccer&league=4328',
    );
  });
});
