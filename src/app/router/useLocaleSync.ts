import { useEffect } from 'react';
import { i18next } from '@/shared/i18n/i18n';
import { STORAGE_KEYS } from '@/shared/constants/storage';
import { writeStoredValue } from '@/shared/storage/safeLocalStorage';
import type { SupportedLocale } from '@/shared/constants/locales';

// The pathname is the source of truth: this keeps i18next, <html lang>, and
// the stored preference following the URL, including on back/forward.
export function useLocaleSync(locale: SupportedLocale): void {
  useEffect(() => {
    void i18next.changeLanguage(locale);
    document.documentElement.lang = locale;
    writeStoredValue(STORAGE_KEYS.language, locale);
  }, [locale]);
}
