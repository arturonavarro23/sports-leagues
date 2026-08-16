import { describe, expect, it } from 'vitest';
import {
  breakpoints,
  colors,
  durations,
  easings,
  fontFamilies,
  fontSizes,
  fontWeights,
  lineHeights,
  radii,
  shadows,
  spacing,
} from './index';

const HEX_COLOR_PATTERN = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

function assertAscending(values: number[]): void {
  for (const [index, current] of values.entries()) {
    if (index === 0) continue;
    const previous = values[index - 1] ?? Number.NEGATIVE_INFINITY;
    expect(current).toBeGreaterThan(previous);
  }
}

describe('colors', () => {
  it('is not empty', () => {
    expect(Object.keys(colors).length).toBeGreaterThan(0);
  });

  it('has only valid hex string values', () => {
    for (const [token, value] of Object.entries(colors)) {
      expect(value, `${token} should be a hex color`).toMatch(
        HEX_COLOR_PATTERN,
      );
    }
  });
});

describe('breakpoints', () => {
  it('is not empty', () => {
    expect(Object.keys(breakpoints).length).toBeGreaterThan(0);
  });

  it('is ordered ascending from sm to xl', () => {
    const order = ['sm', 'md', 'lg', 'xl'] as const;
    const values = order.map((token) => parseFloat(breakpoints[token]));

    assertAscending(values);
  });
});

describe('spacing', () => {
  it('is not empty', () => {
    expect(Object.keys(spacing).length).toBeGreaterThan(0);
  });

  it('is ordered ascending from none to 3xl', () => {
    const order = ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'] as const;
    const values = order.map((token) => parseFloat(spacing[token]));

    assertAscending(values);
  });
});

describe('typography', () => {
  it('has non-empty font family stacks', () => {
    for (const value of Object.values(fontFamilies)) {
      expect(value.length).toBeGreaterThan(0);
    }
  });

  it('has font sizes ordered ascending from xs to 3xl', () => {
    const order = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl'] as const;
    const values = order.map((token) => parseFloat(fontSizes[token]));

    assertAscending(values);
  });

  it('has font weights ordered ascending from regular to bold', () => {
    const order = ['regular', 'medium', 'semibold', 'bold'] as const;
    const values = order.map((token) => fontWeights[token]);

    assertAscending(values);
  });

  it('has line heights ordered ascending from tight to relaxed', () => {
    const order = ['tight', 'normal', 'relaxed'] as const;
    const values = order.map((token) => lineHeights[token]);

    assertAscending(values);
  });
});

describe('motion', () => {
  it('has non-empty easing functions', () => {
    for (const value of Object.values(easings)) {
      expect(value.length).toBeGreaterThan(0);
    }
  });

  it('has durations ordered ascending from instant to normal', () => {
    const order = ['instant', 'fast', 'normal'] as const;
    const values = order.map((token) => parseFloat(durations[token]));

    assertAscending(values);
  });
});

describe('radii', () => {
  it('is not empty', () => {
    expect(Object.keys(radii).length).toBeGreaterThan(0);
  });
});

describe('shadows', () => {
  it('is not empty', () => {
    expect(Object.keys(shadows).length).toBeGreaterThan(0);
  });
});
