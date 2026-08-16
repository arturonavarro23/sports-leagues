import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from './Badge';

const meta = {
  title: 'Design System/Badge',
  component: Badge,
  tags: ['autodocs'],
  args: {
    children: 'Football',
  },
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Neutral: Story = {
  args: {
    variant: 'neutral',
    children: 'Neutral',
  },
};

export const Accent: Story = {
  args: {
    variant: 'accent',
    children: 'Basketball',
  },
};

export const Danger: Story = {
  args: {
    variant: 'danger',
    children: 'Cancelled',
  },
};

export const LongText: Story = {
  args: {
    variant: 'accent',
    children: 'International Rugby Sevens',
  },
};
