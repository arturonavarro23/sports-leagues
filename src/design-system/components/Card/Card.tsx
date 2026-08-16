import type { ElementType } from 'react';
import { cn } from '@/shared/utils/cn';
import type { CardProps } from './Card.types';

export function Card({
  as = 'div',
  isInteractive = false,
  isSelected = false,
  className,
  style,
  children,
  ...rest
}: CardProps) {
  const Component = as as ElementType;

  return (
    <Component
      data-selected={isSelected || undefined}
      className={cn(
        'rounded-card bg-surface-raised shadow-card border-border-subtle border p-4',
        isInteractive && 'duration-fast transition-colors',
        isSelected &&
          'border-accent ring-accent ring-offset-surface-base ring-2 ring-offset-2',
        className,
      )}
      style={style}
      {...rest}
    >
      {children}
    </Component>
  );
}
