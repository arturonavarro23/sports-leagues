import type { IconProps } from './icons.types';

export function ShieldIcon({ className = 'h-10 w-10' }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3 5 6v5c0 4.2 2.8 7.9 7 9 4.2-1.1 7-4.8 7-9V6l-7-3Z" />
    </svg>
  );
}
