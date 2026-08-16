import type { Meta, StoryObj } from '@storybook/react-vite';
import { SeasonBadgeImage } from './SeasonBadgeImage';

const meta = {
  title: 'Leagues/SeasonBadgeImage',
  component: SeasonBadgeImage,
  tags: ['autodocs'],
  args: {
    badge: null,
    isLoading: false,
    isError: false,
    leagueName: 'English Premier League',
  },
} satisfies Meta<typeof SeasonBadgeImage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Loading: Story = {
  args: {
    isLoading: true,
  },
};

export const Success: Story = {
  args: {
    badge: {
      season: '2023-2024',
      badgeUrl:
        'https://www.thesportsdb.com/images/media/league/badge/i6o0kh1549879062.png',
    },
  },
};

export const Missing: Story = {
  args: {
    badge: null,
  },
};

export const Error: Story = {
  args: {
    isError: true,
  },
};

export const ErrorWithoutRetry: Story = {
  args: {
    isError: true,
  },
};
