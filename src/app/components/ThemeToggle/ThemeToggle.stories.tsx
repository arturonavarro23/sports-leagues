import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { ThemeToggle } from './ThemeToggle';

const meta = {
  title: 'App/ThemeToggle',
  component: ThemeToggle,
  tags: ['autodocs'],
  args: {
    label: 'Dark mode',
    value: 'dark',
    onChange: fn(),
  },
} satisfies Meta<typeof ThemeToggle>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Dark: Story = {};

export const Light: Story = {
  args: { value: 'light' },
  globals: { theme: 'light' },
};

export const SpanishLabel: Story = {
  args: { label: 'Modo oscuro' },
  globals: { locale: 'es' },
};

export const NarrowViewport: Story = {
  parameters: { viewport: { defaultViewport: 'narrow' } },
};

export const TogglesOnClick: Story = {
  args: { value: 'light' },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole('switch');

    await expect(toggle).not.toBeChecked();
    await userEvent.click(toggle);
    await expect(args.onChange).toHaveBeenCalledWith('dark');
  },
};
