import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input } from './Input';

const meta = {
  title: 'Design System/Input',
  component: Input,
  tags: ['autodocs'],
  args: {
    label: 'League name',
  },
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithDescription: Story = {
  args: {
    description: 'The full official name of the league.',
  },
};

export const WithError: Story = {
  args: {
    errorMessage: 'This field is required.',
  },
};

export const WithDescriptionAndError: Story = {
  args: {
    description: 'The full official name of the league.',
    errorMessage: 'This field is required.',
  },
};

export const Search: Story = {
  args: {
    label: 'Search leagues',
    type: 'search',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: 'English Premier League',
  },
};

export const LongContent: Story = {
  args: {
    label: 'League name',
    description:
      'This description is intentionally long to verify that the field wraps sensibly and stays readable across a range of viewport widths.',
    defaultValue:
      'The Very Long Official Name Of An International Football League Association',
  },
};
