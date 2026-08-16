import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClientProvider, useQuery } from '@tanstack/react-query';
import { createTestQueryClient } from '@/shared/test/renderWithProviders';
import { expectNoAxeViolations } from '@/shared/test/a11y';
import { QueryErrorBoundary } from './QueryErrorBoundary';

describe('QueryErrorBoundary', () => {
  it('renders the fallback with a custom title when a child throws', () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    function Bomb(): never {
      throw new Error('Fetch failed');
    }

    render(
      <QueryErrorBoundary fallbackTitle="Unable to load leagues">
        <Bomb />
      </QueryErrorBoundary>,
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Unable to load leagues' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Fetch failed')).toBeInTheDocument();

    consoleErrorSpy.mockRestore();
  });

  it('has no axe violations in the fallback state', async () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    function Bomb(): never {
      throw new Error('Fetch failed');
    }

    const { container } = render(
      <QueryErrorBoundary>
        <Bomb />
      </QueryErrorBoundary>,
    );

    await expectNoAxeViolations(container);

    consoleErrorSpy.mockRestore();
  });

  it('resets a failed query and refetches when Try again is clicked', async () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const user = userEvent.setup();
    const queryClient = createTestQueryClient();

    let attempt = 0;
    async function flakyQueryFn(): Promise<string> {
      attempt += 1;
      if (attempt === 1) {
        throw new Error('Network error');
      }
      return 'Loaded data';
    }

    function FlakyComponent() {
      const { data } = useQuery({
        queryKey: ['flaky-test'],
        queryFn: flakyQueryFn,
        throwOnError: true,
      });
      return <p>{data}</p>;
    }

    render(
      <QueryClientProvider client={queryClient}>
        <QueryErrorBoundary>
          <FlakyComponent />
        </QueryErrorBoundary>
      </QueryClientProvider>,
    );

    expect(await screen.findByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Network error')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /try again/i }));

    expect(await screen.findByText('Loaded data')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();

    consoleErrorSpy.mockRestore();
  });
});
