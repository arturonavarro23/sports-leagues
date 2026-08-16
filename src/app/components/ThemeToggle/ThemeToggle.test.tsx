import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expectNoAxeViolations } from '@/shared/test/a11y';
import { ThemeToggle } from './ThemeToggle';

describe('ThemeToggle', () => {
  it('exposes the current theme through the switch state', () => {
    render(<ThemeToggle label="Dark mode" value="dark" onChange={vi.fn()} />);

    expect(screen.getByRole('switch', { name: 'Dark mode' })).toBeChecked();
  });

  it('reports light as the unchecked state', () => {
    render(<ThemeToggle label="Dark mode" value="light" onChange={vi.fn()} />);

    expect(screen.getByRole('switch', { name: 'Dark mode' })).not.toBeChecked();
  });

  it('switches from light to dark', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ThemeToggle label="Dark mode" value="light" onChange={onChange} />);

    await user.click(screen.getByRole('switch'));

    expect(onChange).toHaveBeenCalledWith('dark');
  });

  it('switches from dark to light', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ThemeToggle label="Dark mode" value="dark" onChange={onChange} />);

    await user.click(screen.getByRole('switch'));

    expect(onChange).toHaveBeenCalledWith('light');
  });

  it('is operable with the keyboard', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ThemeToggle label="Dark mode" value="light" onChange={onChange} />);

    await user.tab();
    expect(screen.getByRole('switch')).toHaveFocus();

    await user.keyboard('{Enter}');
    expect(onChange).toHaveBeenCalledWith('dark');
  });

  it('carries a translated accessible name so the icons are never the only cue', () => {
    render(<ThemeToggle label="Modo oscuro" value="dark" onChange={vi.fn()} />);

    expect(
      screen.getByRole('switch', { name: 'Modo oscuro' }),
    ).toBeInTheDocument();
  });

  it('hides the decorative icons from assistive technology', () => {
    const { container } = render(
      <ThemeToggle label="Dark mode" value="dark" onChange={vi.fn()} />,
    );

    const icons = container.querySelectorAll('svg');
    expect(icons).toHaveLength(2);
    icons.forEach((icon) => {
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <ThemeToggle label="Dark mode" value="dark" onChange={vi.fn()} />,
    );

    await expectNoAxeViolations(container);
  });
});
