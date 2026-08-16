import { useId } from 'react';
import { cn } from '@/shared/utils/cn';
import type { ViewModeToggleProps } from './ViewModeToggle.types';

export function ViewModeToggle({
  legend,
  value,
  options,
  onChange,
}: ViewModeToggleProps) {
  const groupName = useId();

  return (
    // Hidden below sm: the grid collapses to one column there, so the two
    // layouts would look identical and the control would do nothing visible.
    <fieldset className="hidden sm:block">
      {/* Hidden visually, not from assistive tech: it names the radio group,
          while the options themselves already carry visible text labels. */}
      <legend className="sr-only">{legend}</legend>
      <div className="border-border-subtle rounded-control flex overflow-hidden border">
        {options.map((option) => {
          const isSelected = option.value === value;

          return (
            <label
              key={option.value}
              className={cn(
                'duration-fast ease-standard flex min-h-9 cursor-pointer items-center px-3 text-sm transition-colors',
                isSelected
                  ? 'bg-accent text-content-inverse font-medium'
                  : 'text-content-secondary hover:bg-surface-overlay',
              )}
            >
              <input
                type="radio"
                name={groupName}
                value={option.value}
                checked={isSelected}
                onChange={() => onChange(option.value)}
                className="sr-only"
              />
              {option.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
