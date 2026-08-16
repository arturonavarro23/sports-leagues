import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { expectNoAxeViolations } from '@/shared/test/a11y';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders neutral variant text', () => {
    render(<Badge variant="neutral">Football</Badge>);
    expect(screen.getByText('Football')).toBeInTheDocument();
  });

  it('renders accent variant text', () => {
    render(<Badge variant="accent">Basketball</Badge>);
    expect(screen.getByText('Basketball')).toBeInTheDocument();
  });

  it('renders danger variant text', () => {
    render(<Badge variant="danger">Cancelled</Badge>);
    expect(screen.getByText('Cancelled')).toBeInTheDocument();
  });

  it('renders as a span element', () => {
    const { container } = render(<Badge>Rugby</Badge>);
    expect(container.querySelector('span')).toHaveTextContent('Rugby');
    expect(container.querySelector('img')).not.toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Badge variant="accent">Tennis</Badge>);
    await expectNoAxeViolations(container);
  });
});
