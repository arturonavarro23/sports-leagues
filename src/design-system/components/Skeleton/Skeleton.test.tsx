import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { expectNoAxeViolations } from '@/shared/test/a11y';
import { Skeleton } from './Skeleton';

describe('Skeleton', () => {
  it('reserves the exact numeric width and height via inline style', () => {
    const { container } = render(<Skeleton width={120} height={16} />);
    const skeleton = container.firstElementChild as HTMLElement;

    expect(skeleton.style.width).toBe('120px');
    expect(skeleton.style.height).toBe('16px');
  });

  it('reserves the exact string width and height via inline style', () => {
    const { container } = render(<Skeleton width="50%" height="2rem" />);
    const skeleton = container.firstElementChild as HTMLElement;

    expect(skeleton.style.width).toBe('50%');
    expect(skeleton.style.height).toBe('2rem');
  });

  it('is hidden from assistive technology', () => {
    const { container } = render(<Skeleton width={40} height={40} />);
    const skeleton = container.firstElementChild as HTMLElement;

    expect(skeleton).toHaveAttribute('aria-hidden', 'true');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <Skeleton width={200} height={24} radius="pill" />,
    );
    await expectNoAxeViolations(container);
  });
});
