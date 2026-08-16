import type { Meta, StoryObj } from '@storybook/react-vite';
import { ErrorState } from './ErrorState';

const meta = {
  title: 'Design System/ErrorState',
  component: ErrorState,
  tags: ['autodocs'],
  args: {
    title: 'Failed to load leagues',
    headingLevel: 2,
  },
} satisfies Meta<typeof ErrorState>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithDescription: Story = {
  args: {
    description: 'Check your connection and try again.',
  },
};

export const WithAction: Story = {
  args: {
    description: 'Check your connection and try again.',
    action: (
      <button
        type="button"
        className="rounded-control bg-accent text-content-inverse px-3 py-1.5 text-sm font-medium"
      >
        Retry
      </button>
    ),
  },
};

export const LongContent: Story = {
  args: {
    title: 'We could not reach the sports leagues service right now',
    description:
      'This can happen when the network connection drops or the upstream service is temporarily unavailable. Please wait a moment and try again.',
    action: (
      <button
        type="button"
        className="rounded-control bg-accent text-content-inverse px-3 py-1.5 text-sm font-medium"
      >
        Retry
      </button>
    ),
  },
};
