import { cn } from '@/shared/utils/cn';
import type { BadgeProps, BadgeVariant } from './Badge.types';

const variantClasses: Record<BadgeVariant, string> = {
  neutral: 'bg-surface-overlay text-content-secondary',
  accent: 'bg-accent/15 text-accent',
  danger: 'bg-danger/15 text-danger',
};

export function Badge({ variant = 'neutral', children }: BadgeProps) {
  return (
    <span
      className={cn(
        'rounded-pill inline-flex items-center px-2 py-0.5 text-xs font-medium',
        variantClasses[variant],
      )}
    >
      {children}
    </span>
  );
}
