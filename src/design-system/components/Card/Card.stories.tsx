import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from './Card';

const meta = {
  title: 'Design System/Card',
  component: Card,
  tags: ['autodocs'],
  args: {
    children: 'Card content',
  },
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AsArticle: Story = {
  args: {
    as: 'article',
    children: 'Rendered as an article element',
  },
};

export const Selected: Story = {
  args: {
    as: 'section',
    'aria-label': 'Selected league',
    isSelected: true,
    children: 'Selected card with border and ring',
  },
};

export const Interactive: Story = {
  args: {
    isInteractive: true,
    role: 'button',
    tabIndex: 0,
    children: 'Interactive card supplied semantics by the consumer',
  },
};

export const LongContent: Story = {
  args: {
    children:
      'This card holds a much longer piece of content to verify the layout keeps its padding and rounded corners even when the text wraps across several lines inside the surface.',
  },
};

export const WithAction: Story = {
  args: {
    children: (
      <div className="flex flex-col gap-3">
        <p>Card with a trailing action supplied by the consumer.</p>
        <button type="button" className="text-accent text-sm font-medium">
          View details
        </button>
      </div>
    ),
  },
};
