import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { expectNoAxeViolations } from '@/shared/test/a11y';
import { App } from './App';

describe('App', () => {
  it('renders the leagues page after redirecting from the root route', async () => {
    const { container } = render(<App />);

    expect(
      await screen.findByRole('heading', { name: 'Sports Leagues' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /skip to main content/i }),
    ).toBeInTheDocument();

    await expectNoAxeViolations(container);
  });
});
