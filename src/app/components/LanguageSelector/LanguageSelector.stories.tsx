import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { LanguageSelector } from './LanguageSelector';

const options = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
] as const;

const meta = {
  title: 'App/LanguageSelector',
  component: LanguageSelector,
  tags: ['autodocs'],
  args: {
    label: 'Language',
    locale: 'en',
    options: [...options],
    onChange: fn(),
  },
} satisfies Meta<typeof LanguageSelector>;

export default meta;

type Story = StoryObj<typeof meta>;

export const English: Story = {};

export const Spanish: Story = {
  args: {
    locale: 'es',
  },
};

export const NarrowViewport: Story = {
  parameters: {
    viewport: { defaultViewport: 'narrow' },
  },
};
