import type { ReactNode } from 'react';

export type BadgeVariant = 'neutral' | 'accent' | 'danger';

export interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
}
