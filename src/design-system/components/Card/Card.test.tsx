import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { expectNoAxeViolations } from '@/shared/test/a11y';
import { Card } from './Card';

describe('Card', () => {
  it('renders its children', () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('renders as a div by default', () => {
    const { container } = render(<Card>Plain card</Card>);
    expect(container.querySelector('div')).toBeInTheDocument();
  });

  it('honours the as prop', () => {
    render(<Card as="article">Article body</Card>);
    expect(screen.getByRole('article')).toHaveTextContent('Article body');
  });

  it('never renders a button', () => {
    const { container } = render(<Card isInteractive>Interactive card</Card>);
    expect(container.querySelector('button')).not.toBeInTheDocument();
  });

  it('exposes the selected state as a DOM attribute', () => {
    render(
      <>
        <Card as="section" aria-label="unselected">
          Unselected
        </Card>
        <Card as="section" aria-label="selected" isSelected>
          Selected
        </Card>
      </>,
    );

    expect(screen.getByRole('region', { name: 'selected' })).toHaveAttribute(
      'data-selected',
    );
    expect(
      screen.getByRole('region', { name: 'unselected' }),
    ).not.toHaveAttribute('data-selected');
  });

  it('does not let a caller style override clobber the selected ring', () => {
    render(
      <Card as="section" aria-label="selected" isSelected style={{ margin: 8 }}>
        Selected
      </Card>,
    );

    const selected = screen.getByRole('region', { name: 'selected' });
    expect(selected.style.margin).toBe('8px');
    expect(selected).toHaveAttribute('data-selected');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Card isSelected>Accessible content</Card>);
    await expectNoAxeViolations(container);
  });
});
