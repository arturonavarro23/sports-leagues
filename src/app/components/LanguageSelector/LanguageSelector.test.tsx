import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '@/shared/test/a11y';
import { LanguageSelector } from './LanguageSelector';
import type { LanguageOption } from './LanguageSelector.types';

const options: LanguageOption[] = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
];

describe('LanguageSelector', () => {
  it('exposes the current locale as the select value', () => {
    render(
      <LanguageSelector
        label="Language"
        locale="es"
        options={options}
        onChange={vi.fn()}
      />,
    );

    expect(screen.getByLabelText('Language')).toHaveValue('es');
  });

  it('renders every locale option', () => {
    render(
      <LanguageSelector
        label="Language"
        locale="en"
        options={options}
        onChange={vi.fn()}
      />,
    );

    expect(screen.getByRole('option', { name: 'English' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Español' })).toBeInTheDocument();
  });

  it('calls onChange with the newly selected locale', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <LanguageSelector
        label="Language"
        locale="en"
        options={options}
        onChange={onChange}
      />,
    );

    await user.selectOptions(screen.getByLabelText('Language'), 'Español');

    expect(onChange).toHaveBeenCalledWith('es');
  });

  it('is reachable via the keyboard', async () => {
    const user = userEvent.setup();
    render(
      <LanguageSelector
        label="Language"
        locale="en"
        options={options}
        onChange={vi.fn()}
      />,
    );

    await user.tab();
    expect(screen.getByLabelText('Language')).toHaveFocus();
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <LanguageSelector
        label="Language"
        locale="en"
        options={options}
        onChange={vi.fn()}
      />,
    );

    await expectNoAxeViolations(container);
  });
});
