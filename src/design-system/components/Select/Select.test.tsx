import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '@/shared/test/a11y';
import { Select } from './Select';

const options = [
  { value: 'epl', label: 'English Premier League' },
  { value: 'laliga', label: 'La Liga' },
  { value: 'seriea', label: 'Serie A' },
];

describe('Select', () => {
  it('associates the label with a native select element', () => {
    render(<Select label="League" options={options} />);

    const select = screen.getByLabelText('League');
    expect(select.tagName).toBe('SELECT');
  });

  it('generates an id via useId when none is provided', () => {
    render(<Select label="League" options={options} />);

    expect(screen.getByLabelText('League')).toHaveAttribute('id');
  });

  it('respects an explicit id', () => {
    render(<Select label="League" options={options} id="league-select" />);

    expect(screen.getByLabelText('League')).toHaveAttribute(
      'id',
      'league-select',
    );
  });

  it('renders every option as a listbox option', () => {
    render(<Select label="League" options={options} />);

    for (const option of options) {
      expect(
        screen.getByRole('option', { name: option.label }),
      ).toBeInTheDocument();
    }
  });

  it('fires onChange with the newly selected value', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Select label="League" options={options} onChange={onChange} />);

    await user.selectOptions(screen.getByLabelText('League'), 'La Liga');

    expect(onChange).toHaveBeenCalled();
    expect(screen.getByLabelText('League')).toHaveValue('laliga');
  });

  it('is reachable via the keyboard', async () => {
    const user = userEvent.setup();
    render(<Select label="League" options={options} />);

    await user.tab();
    expect(screen.getByLabelText('League')).toHaveFocus();
  });

  it('forwards the ref to the underlying select element', () => {
    const ref = createRef<HTMLSelectElement>();
    render(<Select label="League" options={options} ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLSelectElement);
  });

  it('has no axe violations', async () => {
    const { container } = render(<Select label="League" options={options} />);

    await expectNoAxeViolations(container);
  });
});
