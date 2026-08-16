import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { expectNoAxeViolations } from '@/shared/test/a11y';
import { Input } from './Input';

describe('Input', () => {
  it('associates the label with the input', () => {
    render(<Input label="League name" />);

    expect(screen.getByLabelText('League name')).toBeInTheDocument();
  });

  it('generates an id via useId when none is provided', () => {
    render(<Input label="League name" />);

    const input = screen.getByLabelText('League name');
    expect(input).toHaveAttribute('id');
  });

  it('respects an explicit id', () => {
    render(<Input label="League name" id="league-name" />);

    expect(screen.getByLabelText('League name')).toHaveAttribute(
      'id',
      'league-name',
    );
  });

  it('renders the description text', () => {
    render(<Input label="League name" description="Full official name" />);

    expect(screen.getByText('Full official name')).toBeInTheDocument();
  });

  it('supports type="search"', () => {
    render(<Input label="Search leagues" type="search" />);

    expect(
      screen.getByRole('searchbox', { name: 'Search leagues' }),
    ).toBeInTheDocument();
  });

  it('wires aria-invalid, aria-describedby and role="alert" when there is an error', () => {
    render(<Input label="League name" errorMessage="This field is required" />);

    const input = screen.getByLabelText('League name');
    expect(input).toHaveAttribute('aria-invalid', 'true');

    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('This field is required');
    expect(input.getAttribute('aria-describedby')).toContain(alert.id);
  });

  it('describes both the description and the error when both are present', () => {
    render(
      <Input
        label="League name"
        description="Full official name"
        errorMessage="This field is required"
      />,
    );

    const input = screen.getByLabelText('League name');
    const describedBy = input.getAttribute('aria-describedby') ?? '';
    const description = screen.getByText('Full official name');
    const alert = screen.getByRole('alert');

    expect(describedBy).toContain(description.id);
    expect(describedBy).toContain(alert.id);
  });

  it('accepts typed input', async () => {
    const user = userEvent.setup();
    render(<Input label="League name" />);

    const input = screen.getByLabelText('League name');
    await user.type(input, 'Premier League');

    expect(input).toHaveValue('Premier League');
  });

  it('forwards the ref to the underlying input element', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Input label="League name" ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('has no axe violations', async () => {
    const { container } = render(<Input label="League name" />);

    await expectNoAxeViolations(container);
  });

  it('has no axe violations with an error message', async () => {
    const { container } = render(
      <Input label="League name" errorMessage="This field is required" />,
    );

    await expectNoAxeViolations(container);
  });
});
