import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { MoonIcon, ShieldIcon, SunIcon } from './index';

const icons = [
  ['SunIcon', SunIcon],
  ['MoonIcon', MoonIcon],
  ['ShieldIcon', ShieldIcon],
] as const;

describe('icons', () => {
  it.each(icons)('%s is hidden from assistive technology', (_name, Icon) => {
    const { container } = render(<Icon />);
    const svg = container.querySelector('svg');

    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).toHaveAttribute('focusable', 'false');
  });

  it.each(icons)('%s accepts a size override', (_name, Icon) => {
    const { container } = render(<Icon className="h-8 w-8" />);

    expect(container.querySelector('svg')).toHaveClass('h-8', 'w-8');
  });
});
