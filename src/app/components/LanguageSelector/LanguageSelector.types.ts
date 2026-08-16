import type { SupportedLocale } from '@/shared/constants/locales';

export interface LanguageOption {
  value: SupportedLocale;
  label: string;
}

export interface LanguageSelectorProps {
  label: string;
  locale: SupportedLocale;
  options: LanguageOption[];
  onChange: (locale: SupportedLocale) => void;
}
