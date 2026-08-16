import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { LeagueFilters } from './LeagueFilters';

const sportOptions = [
  { value: '', label: 'All sports' },
  { value: 'Soccer', label: 'Soccer' },
  { value: 'Ice Hockey', label: 'Ice Hockey' },
  { value: 'Basketball', label: 'Basketball' },
];

const meta = {
  title: 'Leagues/LeagueFilters',
  component: LeagueFilters,
  tags: ['autodocs'],
  args: {
    searchValue: '',
    onSearchChange: fn(),
    sportValue: '',
    sportOptions,
    onSportChange: fn(),
    resultCount: 24,
  },
} satisfies Meta<typeof LeagueFilters>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithSearchValue: Story = {
  args: {
    searchValue: 'premier',
    resultCount: 3,
  },
};

export const SportSelected: Story = {
  args: {
    sportValue: 'Soccer',
    resultCount: 8,
  },
};

export const NoResults: Story = {
  args: {
    searchValue: 'zzz',
    resultCount: 0,
  },
};

export const NarrowViewport: Story = {
  parameters: {
    viewport: { defaultViewport: 'narrow' },
  },
};
