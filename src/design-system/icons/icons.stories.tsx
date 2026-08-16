import type { Meta, StoryObj } from '@storybook/react-vite';
import { MoonIcon, ShieldIcon, SunIcon } from './index';

const icons = [
  { name: 'SunIcon', Icon: SunIcon },
  { name: 'MoonIcon', Icon: MoonIcon },
  { name: 'ShieldIcon', Icon: ShieldIcon },
];

function IconGallery({ className }: { className: string }) {
  return (
    <ul className="text-content-primary flex flex-wrap gap-6">
      {icons.map(({ name, Icon }) => (
        <li key={name} className="flex flex-col items-center gap-2">
          <Icon className={className} />
          <span className="text-content-secondary text-xs">{name}</span>
        </li>
      ))}
    </ul>
  );
}

const meta = {
  title: 'Design system/Icons',
  component: IconGallery,
  tags: ['autodocs'],
  args: { className: 'h-6 w-6' },
} satisfies Meta<typeof IconGallery>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Large: Story = {
  args: { className: 'h-10 w-10' },
};

export const OnLightTheme: Story = {
  globals: { theme: 'light' },
};
