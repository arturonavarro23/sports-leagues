import type { Meta, StoryObj } from '@storybook/react-vite';
import { LeaguesSkeleton } from './LeaguesSkeleton';

const meta = {
  title: 'Leagues/LeaguesSkeleton',
  component: LeaguesSkeleton,
  tags: ['autodocs'],
} satisfies Meta<typeof LeaguesSkeleton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const FewCards: Story = {
  args: { cardCount: 2 },
};

export const LightTheme: Story = {
  globals: { theme: 'light' },
};

export const NarrowViewport: Story = {
  parameters: { viewport: { defaultViewport: 'narrow' } },
};
