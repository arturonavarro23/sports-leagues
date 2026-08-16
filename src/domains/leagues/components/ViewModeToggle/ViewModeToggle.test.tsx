import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expectNoAxeViolations } from '@/shared/test/a11y';
import { ViewModeToggle } from './ViewModeToggle';

const options = [
  { value: 'grid' as const, label: 'Grid' },
  { value: 'list' as const, label: 'List' },
];

function renderToggle(value: 'grid' | 'list', onChange = vi.fn()) {
  render(
    <ViewModeToggle
      legend="View"
      value={value}
      options={options}
      onChange={onChange}
    />,
  );
  return onChange;
}

describe('ViewModeToggle', () => {
  it('exposes the current mode as the checked radio', () => {
    renderToggle('grid');

    expect(screen.getByRole('radio', { name: 'Grid' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'List' })).not.toBeChecked();
  });

  it('emits the selected mode', async () => {
    const user = userEvent.setup();
    const onChange = renderToggle('grid');

    await user.click(screen.getByRole('radio', { name: 'List' }));

    expect(onChange).toHaveBeenCalledWith('list');
  });

  it('groups the options under an accessible legend', () => {
    renderToggle('grid');

    expect(screen.getByRole('group', { name: 'View' })).toBeInTheDocument();
  });

  it('is reachable and operable with the keyboard', async () => {
    const user = userEvent.setup();
    const onChange = renderToggle('grid');

    await user.tab();
    expect(screen.getByRole('radio', { name: 'Grid' })).toHaveFocus();

    await user.keyboard('{ArrowRight}');
    expect(onChange).toHaveBeenCalledWith('list');
  });

  it('renders translated labels', () => {
    render(
      <ViewModeToggle
        legend="Vista"
        value="list"
        options={[
          { value: 'grid', label: 'Cuadrícula' },
          { value: 'list', label: 'Lista' },
        ]}
        onChange={vi.fn()}
      />,
    );

    expect(
      screen.getByRole('radio', { name: 'Cuadrícula' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Lista' })).toBeChecked();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <ViewModeToggle
        legend="View"
        value="grid"
        options={options}
        onChange={vi.fn()}
      />,
    );

    await expectNoAxeViolations(container);
  });
});
