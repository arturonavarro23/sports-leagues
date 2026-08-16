import { MoonIcon, SunIcon } from '@/design-system/icons';
import { cn } from '@/shared/utils/cn';
import type { ThemeToggleProps } from './ThemeToggle.types';

export function ThemeToggle({ label, value, onChange }: ThemeToggleProps) {
  const isDark = value === 'dark';

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={label}
      onClick={() => onChange(isDark ? 'light' : 'dark')}
      className={cn(
        'rounded-pill border-border-strong bg-surface-overlay duration-fast ease-standard relative inline-flex min-h-11 w-[4.5rem] items-center border transition-colors',
      )}
    >
      <span className="text-content-secondary pointer-events-none absolute inset-0 flex items-center justify-between px-2.5">
        <SunIcon />
        <MoonIcon />
      </span>
      <span
        aria-hidden="true"
        className={cn(
          'bg-accent duration-fast ease-standard rounded-pill relative h-8 w-8 transition-transform',
          isDark ? 'translate-x-[2.25rem]' : 'translate-x-1',
        )}
      />
    </button>
  );
}
