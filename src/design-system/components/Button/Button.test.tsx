import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '@/shared/test/a11y';
import { Button } from './Button';
import type { ButtonSize, ButtonVariant } from './Button.types';

describe('Button', () => {
  it('renders an accessible name from its children', () => {
    render(<Button>Save league</Button>);

    expect(
      screen.getByRole('button', { name: 'Save league' }),
    ).toBeInTheDocument();
  });

  it.each<ButtonVariant>(['primary', 'secondary', 'ghost'])(
    'renders the %s variant',
    (variant) => {
      render(<Button variant={variant}>Continue</Button>);

      expect(screen.getByRole('button', { name: 'Continue' })).toBeEnabled();
    },
  );

  it.each<ButtonSize>(['sm', 'md'])('renders the %s size', (size) => {
    render(<Button size={size}>Continue</Button>);

    expect(screen.getByRole('button', { name: 'Continue' })).toBeEnabled();
  });

  it('defaults to type="button"', () => {
    render(<Button>Continue</Button>);

    expect(screen.getByRole('button', { name: 'Continue' })).toHaveAttribute(
      'type',
      'button',
    );
  });

  it('honors an explicit type override', () => {
    render(<Button type="submit">Submit</Button>);

    expect(screen.getByRole('button', { name: 'Submit' })).toHaveAttribute(
      'type',
      'submit',
    );
  });

  it('prevents the click handler from firing when disabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Disabled
      </Button>,
    );

    await user.click(screen.getByRole('button', { name: 'Disabled' }));

    expect(onClick).not.toHaveBeenCalled();
  });

  it('sets aria-busy and blocks interaction while loading', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button isLoading onClick={onClick}>
        Save league
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Save league' });
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toBeDisabled();

    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('keeps the label content in the DOM while loading', () => {
    render(<Button isLoading>Save league</Button>);

    expect(screen.getByText('Save league')).toBeInTheDocument();
  });

  it('activates the click handler on Enter and Space via the keyboard', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Continue</Button>);

    await user.tab();
    expect(screen.getByRole('button', { name: 'Continue' })).toHaveFocus();

    await user.keyboard('{Enter}');
    expect(onClick).toHaveBeenCalledTimes(1);

    await user.keyboard(' ');
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it('forwards the ref to the underlying button element', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Continue</Button>);

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('has no axe violations', async () => {
    const { container } = render(<Button>Save league</Button>);

    await expectNoAxeViolations(container);
  });

  it('has no axe violations while loading', async () => {
    const { container } = render(<Button isLoading>Save league</Button>);

    await expectNoAxeViolations(container);
  });
});
