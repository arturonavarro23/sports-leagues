import type { Meta, StoryObj } from '@storybook/react-vite';
import { Select } from './Select';

const options = [
  { value: 'epl', label: 'English Premier League' },
  { value: 'laliga', label: 'La Liga' },
  { value: 'seriea', label: 'Serie A' },
];

const meta = {
  title: 'Design System/Select',
  component: Select,
  tags: ['autodocs'],
  args: {
    label: 'League',
    options,
  },
} satisfies Meta<typeof Select>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const LongContent: Story = {
  args: {
    label: 'Competition',
    options: [
      ...options,
      {
        value: 'international-cup',
        label:
          'The International Championship Cup for National Federations Association',
      },
    ],
  },
};
