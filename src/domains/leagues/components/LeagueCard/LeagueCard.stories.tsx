import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { LeagueCard } from './LeagueCard';
import { SeasonBadgeImage } from '../SeasonBadgeImage';

const meta = {
  title: 'Leagues/LeagueCard',
  component: LeagueCard,
  tags: ['autodocs'],
  args: {
    league: {
      id: 'league-1',
      name: 'English Premier League',
      sport: 'Soccer',
      alternateNames: ['EPL', 'Premier League'],
    },
    isSelected: false,
    onSelect: fn(),
  },
} satisfies Meta<typeof LeagueCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithoutAlternativeName: Story = {
  args: {
    league: {
      id: 'league-2',
      name: 'National Hockey League',
      sport: 'Ice Hockey',
      alternateNames: [],
    },
  },
};

export const Selected: Story = {
  args: {
    isSelected: true,
  },
};

export const BadgeLoading: Story = {
  args: {
    isSelected: true,
    badgeSlot: (
      <SeasonBadgeImage
        badge={null}
        isLoading
        isError={false}
        leagueName="English Premier League"
      />
    ),
  },
};

export const WithBadge: Story = {
  args: {
    isSelected: true,
    badgeSlot: (
      <SeasonBadgeImage
        badge={{
          season: '2023-2024',
          badgeUrl:
            'https://www.thesportsdb.com/images/media/league/badge/i6o0kh1549879062.png',
        }}
        isLoading={false}
        isError={false}
        leagueName="English Premier League"
      />
    ),
  },
};

export const BadgeUnavailable: Story = {
  args: {
    isSelected: true,
    badgeSlot: (
      <SeasonBadgeImage
        badge={null}
        isLoading={false}
        isError={false}
        leagueName="English Premier League"
      />
    ),
  },
};

export const BadgeError: Story = {
  args: {
    isSelected: true,
    badgeSlot: (
      <SeasonBadgeImage
        badge={null}
        isLoading={false}
        isError
        leagueName="English Premier League"
      />
    ),
  },
};

export const LongContent: Story = {
  args: {
    league: {
      id: 'league-3',
      name: 'The International Championship of Extremely Competitive Amateur Sporting Federations',
      sport: 'Multi-sport',
      alternateNames: [
        'The Extraordinarily Long Alternate Name for This Particular League That Keeps Going',
      ],
    },
  },
};

export const NarrowViewport: Story = {
  parameters: {
    viewport: { defaultViewport: 'narrow' },
  },
};

export const TogglesSelectionOnClick: Story = {
  render: (args) => {
    function Wrapper() {
      const [isSelected, setIsSelected] = useState(args.isSelected);

      return (
        <LeagueCard
          {...args}
          isSelected={isSelected}
          onSelect={(leagueId) => {
            args.onSelect(leagueId);
            setIsSelected((previous) => !previous);
          }}
        />
      );
    }

    return <Wrapper />;
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', {
      name: /English Premier League/,
    });

    expect(button).toHaveAttribute('aria-pressed', 'false');

    await userEvent.click(button);

    expect(args.onSelect).toHaveBeenCalledWith('league-1');
    expect(button).toHaveAttribute('aria-pressed', 'true');
  },
};
