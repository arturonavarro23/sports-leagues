import { Select } from '@/design-system/components/Select';
import type { SupportedLocale } from '@/shared/constants/locales';
import type { LanguageSelectorProps } from './LanguageSelector.types';

export function LanguageSelector({
  label,
  locale,
  options,
  onChange,
}: LanguageSelectorProps) {
  return (
    <Select
      label={label}
      value={locale}
      options={options}
      onChange={(event) => onChange(event.target.value as SupportedLocale)}
    />
  );
}
