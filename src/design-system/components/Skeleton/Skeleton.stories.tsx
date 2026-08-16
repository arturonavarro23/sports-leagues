import type { Meta, StoryObj } from '@storybook/react-vite';
import { Skeleton } from './Skeleton';

const meta = {
  title: 'Design System/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  args: {
    width: 200,
    height: 20,
  },
} satisfies Meta<typeof Skeleton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const TextLine: Story = {
  args: {
    width: 240,
    height: 16,
    radius: 'control',
  },
};

export const Avatar: Story = {
  args: {
    width: 48,
    height: 48,
    radius: 'pill',
  },
};

export const CardPlaceholder: Story = {
  args: {
    width: '100%',
    height: 120,
    radius: 'card',
  },
};

export const StackedLines: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Skeleton width={220} height={14} />
      <Skeleton width={180} height={14} />
      <Skeleton width={140} height={14} />
    </div>
  ),
};
