import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expectNoAxeViolations } from '@/shared/test/a11y';
import { AppErrorBoundary } from './AppErrorBoundary';

function Bomb({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error('Boom');
  }
  return <p>Recovered content</p>;
}

describe('AppErrorBoundary', () => {
  it('renders the fallback when a child throws', () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    render(
      <AppErrorBoundary>
        <Bomb shouldThrow />
      </AppErrorBoundary>,
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /something went wrong/i }),
    ).toBeInTheDocument();
    expect(screen.getByText('Boom')).toBeInTheDocument();

    consoleErrorSpy.mockRestore();
  });

  it('recovers when Try again is clicked after the child stops throwing', async () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const user = userEvent.setup();

    let shouldThrow = true;
    function Toggle() {
      return <Bomb shouldThrow={shouldThrow} />;
    }

    const { rerender } = render(
      <AppErrorBoundary>
        <Toggle />
      </AppErrorBoundary>,
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();

    shouldThrow = false;
    await user.click(screen.getByRole('button', { name: /try again/i }));
    rerender(
      <AppErrorBoundary>
        <Toggle />
      </AppErrorBoundary>,
    );

    expect(screen.getByText('Recovered content')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();

    consoleErrorSpy.mockRestore();
  });

  it('has no axe violations in the fallback state', async () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const { container } = render(
      <AppErrorBoundary>
        <Bomb shouldThrow />
      </AppErrorBoundary>,
    );

    await expectNoAxeViolations(container);

    consoleErrorSpy.mockRestore();
  });
});
