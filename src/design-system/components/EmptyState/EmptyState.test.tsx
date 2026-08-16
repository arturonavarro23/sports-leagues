import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expectNoAxeViolations } from '@/shared/test/a11y';
import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  it('renders the title and description', () => {
    render(
      <EmptyState
        title="No leagues found"
        description="Try adjusting your filters"
        headingLevel={2}
      />,
    );
    expect(screen.getByText('No leagues found')).toBeInTheDocument();
    expect(screen.getByText('Try adjusting your filters')).toBeInTheDocument();
  });

  it('does not expose an alert role', () => {
    render(<EmptyState title="No leagues found" headingLevel={2} />);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('renders and wires up the action node', async () => {
    const user = userEvent.setup();
    const onClear = vi.fn();
    render(
      <EmptyState
        title="No leagues found"
        headingLevel={2}
        action={<button onClick={onClear}>Clear filters</button>}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Clear filters' }));
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('renders the title at the requested heading level', () => {
    render(<EmptyState title="No leagues found" headingLevel={4} />);
    expect(
      screen.getByRole('heading', { level: 4, name: 'No leagues found' }),
    ).toBeInTheDocument();
  });

  it('defaults to an h3 heading', () => {
    render(<EmptyState title="No leagues found" />);
    expect(
      screen.getByRole('heading', { level: 3, name: 'No leagues found' }),
    ).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <EmptyState
        title="No leagues found"
        description="Try adjusting your filters"
        headingLevel={2}
        action={<button>Clear filters</button>}
      />,
    );
    await expectNoAxeViolations(container);
  });
});
