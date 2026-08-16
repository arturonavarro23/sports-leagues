import type { Meta, StoryObj } from '@storybook/react-vite';
import { EmptyState } from './EmptyState';

const meta = {
  title: 'Design System/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  args: {
    title: 'No leagues found',
    headingLevel: 2,
  },
} satisfies Meta<typeof EmptyState>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithDescription: Story = {
  args: {
    description: 'Try adjusting your filters or search term.',
  },
};

export const WithAction: Story = {
  args: {
    description: 'Try adjusting your filters or search term.',
    action: (
      <button
        type="button"
        className="rounded-control border-border-strong border px-3 py-1.5 text-sm font-medium"
      >
        Clear filters
      </button>
    ),
  },
};

export const LongContent: Story = {
  args: {
    title: 'No sports leagues match the current filters',
    description:
      'Try broadening your search, selecting a different sport, or clearing the filters to see every league available in this dataset.',
    action: (
      <button
        type="button"
        className="rounded-control border-border-strong border px-3 py-1.5 text-sm font-medium"
      >
        Clear filters
      </button>
    ),
  },
};
