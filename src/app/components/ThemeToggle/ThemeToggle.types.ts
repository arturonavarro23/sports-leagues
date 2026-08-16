import type { ThemePreference } from '@/shared/theme/themeTypes';

export interface ThemeToggleProps {
  label: string;
  value: ThemePreference;
  onChange: (value: ThemePreference) => void;
}
