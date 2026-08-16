import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { LeagueGrid } from './LeagueGrid';
import { SeasonBadgeImage } from '../SeasonBadgeImage';

const leagues = [
  {
    id: 'league-1',
    name: 'English Premier League',
    sport: 'Soccer',
    alternateNames: ['EPL'],
  },
  {
    id: 'league-2',
    name: 'National Hockey League',
    sport: 'Ice Hockey',
    alternateNames: [],
  },
  {
    id: 'league-3',
    name: 'National Basketball Association',
    sport: 'Basketball',
    alternateNames: ['NBA'],
  },
];

const meta = {
  title: 'Leagues/LeagueGrid',
  component: LeagueGrid,
  tags: ['autodocs'],
  args: {
    leagues,
    selectedLeagueId: null,
    onSelectLeague: fn(),
    isLoading: false,
  },
} satisfies Meta<typeof LeagueGrid>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
  args: {
    isLoading: true,
    leagues: [],
  },
};

export const Empty: Story = {
  args: {
    leagues: [],
  },
};

export const WithSelectedBadge: Story = {
  args: {
    selectedLeagueId: 'league-1',
    renderBadge: (league) => (
      <SeasonBadgeImage
        badge={{
          season: '2023-2024',
          badgeUrl:
            'https://www.thesportsdb.com/images/media/league/badge/i6o0kh1549879062.png',
        }}
        isLoading={false}
        isError={false}
        leagueName={league.name}
      />
    ),
  },
};

export const NarrowViewport: Story = {
  parameters: {
    viewport: { defaultViewport: 'narrow' },
  },
};
