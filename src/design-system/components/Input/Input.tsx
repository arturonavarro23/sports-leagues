import { forwardRef, useId } from 'react';
import { cn } from '@/shared/utils/cn';
import type { InputProps } from './Input.types';

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, id, description, errorMessage, className, ...rest }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const descriptionId = `${inputId}-description`;
    const errorId = `${inputId}-error`;

    const describedBy =
      [description ? descriptionId : null, errorMessage ? errorId : null]
        .filter(Boolean)
        .join(' ') || undefined;

    return (
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={inputId}
          className="text-content-primary text-sm font-medium"
        >
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          aria-invalid={errorMessage ? 'true' : undefined}
          aria-describedby={describedBy}
          className={cn(
            'rounded-control border-border-subtle bg-surface-raised text-content-primary placeholder:text-content-muted min-h-11 border px-3',
            errorMessage && 'border-danger',
            className,
          )}
          {...rest}
        />
        {description && (
          <span id={descriptionId} className="text-content-secondary text-sm">
            {description}
          </span>
        )}
        {errorMessage && (
          <span id={errorId} role="alert" className="text-danger text-sm">
            {errorMessage}
          </span>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
