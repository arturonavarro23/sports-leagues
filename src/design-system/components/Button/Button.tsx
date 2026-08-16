import { forwardRef } from 'react';
import { cn } from '@/shared/utils/cn';
import type { ButtonProps } from './Button.types';

const VARIANT_CLASSES: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'bg-accent text-content-inverse hover:bg-accent-strong',
  secondary:
    'bg-surface-raised text-content-primary border border-border-subtle hover:bg-surface-overlay',
  ghost: 'bg-transparent text-content-primary hover:bg-surface-raised',
};

const SIZE_CLASSES: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'min-h-11 px-4 text-base',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      className,
      children,
      type = 'button',
      ...rest
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        aria-busy={isLoading || undefined}
        disabled={disabled || isLoading}
        className={cn(
          'rounded-control duration-fast ease-standard relative inline-flex items-center justify-center gap-2 font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60',
          VARIANT_CLASSES[variant],
          SIZE_CLASSES[size],
          className,
        )}
        {...rest}
      >
        {/* opacity-0, not invisible: visibility:hidden would drop the label
            out of the accessibility tree and leave the button unnamed. */}
        <span
          className={cn(
            'inline-flex items-center gap-2',
            isLoading && 'opacity-0',
          )}
        >
          {children}
        </span>
        {isLoading && (
          <span
            aria-hidden="true"
            className="absolute inset-0 flex items-center justify-center"
          >
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          </span>
        )}
      </button>
    );
  },
);

Button.displayName = 'Button';
