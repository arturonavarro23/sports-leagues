import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { ViewModeToggle } from './ViewModeToggle';

const meta = {
  title: 'Leagues/ViewModeToggle',
  component: ViewModeToggle,
  tags: ['autodocs'],
  args: {
    legend: 'View',
    value: 'grid',
    options: [
      { value: 'grid', label: 'Grid' },
      { value: 'list', label: 'List' },
    ],
    onChange: fn(),
  },
} satisfies Meta<typeof ViewModeToggle>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Grid: Story = {};

export const List: Story = {
  args: { value: 'list' },
};

export const LightTheme: Story = {
  globals: { theme: 'light' },
};

export const Spanish: Story = {
  globals: { locale: 'es' },
  args: {
    legend: 'Vista',
    options: [
      { value: 'grid', label: 'Cuadrícula' },
      { value: 'list', label: 'Lista' },
    ],
  },
};

export const NarrowViewport: Story = {
  parameters: { viewport: { defaultViewport: 'narrow' } },
};

export const SelectsListOnClick: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('radio', { name: 'List' }));
    await expect(args.onChange).toHaveBeenCalledWith('list');
  },
};
