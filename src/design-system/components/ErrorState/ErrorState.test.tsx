import { describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expectNoAxeViolations } from '@/shared/test/a11y';
import { ErrorState } from './ErrorState';

describe('ErrorState', () => {
  it('exposes an alert role containing the title', () => {
    render(<ErrorState title="Failed to load leagues" headingLevel={2} />);
    const alert = screen.getByRole('alert');
    expect(
      within(alert).getByText('Failed to load leagues'),
    ).toBeInTheDocument();
  });

  it('renders the description when provided', () => {
    render(
      <ErrorState
        title="Failed to load leagues"
        description="Check your connection and try again"
        headingLevel={2}
      />,
    );
    expect(
      screen.getByText('Check your connection and try again'),
    ).toBeInTheDocument();
  });

  it('renders and wires up the action node', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    render(
      <ErrorState
        title="Failed to load leagues"
        headingLevel={2}
        action={<button onClick={onRetry}>Retry</button>}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Retry' }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('renders the title at the requested heading level', () => {
    render(<ErrorState title="Failed to load leagues" headingLevel={4} />);
    expect(
      screen.getByRole('heading', { level: 4, name: 'Failed to load leagues' }),
    ).toBeInTheDocument();
  });

  it('defaults to an h3 heading', () => {
    render(<ErrorState title="Failed to load leagues" />);
    expect(
      screen.getByRole('heading', { level: 3, name: 'Failed to load leagues' }),
    ).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <ErrorState
        title="Failed to load leagues"
        description="Check your connection and try again"
        headingLevel={2}
        action={<button>Retry</button>}
      />,
    );
    await expectNoAxeViolations(container);
  });
});
