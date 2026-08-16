import { forwardRef, useId } from 'react';
import { cn } from '@/shared/utils/cn';
import type { SelectProps } from './Select.types';

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, id, options, className, ...rest }, ref) => {
    const generatedId = useId();
    const selectId = id ?? generatedId;

    return (
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={selectId}
          className="text-content-primary text-sm font-medium"
        >
          {label}
        </label>
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              'rounded-control border-border-subtle bg-surface-raised text-content-primary min-h-11 w-full appearance-none border py-2 pr-10 pl-3',
              className,
            )}
            {...rest}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <svg
            aria-hidden="true"
            focusable="false"
            viewBox="0 0 20 20"
            className="text-content-secondary pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m5 7.5 5 5 5-5" />
          </svg>
        </div>
      </div>
    );
  },
);

Select.displayName = 'Select';
