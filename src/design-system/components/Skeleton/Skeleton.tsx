import { cn } from '@/shared/utils/cn';
import type { SkeletonProps, SkeletonRadius } from './Skeleton.types';

const radiusClasses: Record<SkeletonRadius, string> = {
  control: 'rounded-control',
  card: 'rounded-card',
  pill: 'rounded-pill',
};

export function Skeleton({
  width,
  height,
  radius = 'control',
  className,
}: SkeletonProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'bg-surface-overlay block animate-pulse',
        radiusClasses[radius],
        className,
      )}
      style={{ width, height }}
    />
  );
}
