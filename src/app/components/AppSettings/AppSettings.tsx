import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { LanguageSelector } from '@/app/components/LanguageSelector';
import { ThemeToggle } from '@/app/components/ThemeToggle';
import { useLocaleSwitcher } from '@/app/router/useLocaleSwitcher';
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from '@/shared/constants/locales';
import { isSupportedLocale } from '@/shared/i18n/localePath';
import { useLeaguePreferencesStore } from '@/domains/leagues/stores/leaguePreferencesStore';

const LOCALE_LABEL_KEYS: Record<string, string> = {
  en: 'language.english',
  es: 'language.spanish',
};

export function AppSettings() {
  const { t } = useTranslation();
  const { locale } = useParams();
  const activeLocale = isSupportedLocale(locale) ? locale : DEFAULT_LOCALE;
  const switchLocale = useLocaleSwitcher();

  const themePreference = useLeaguePreferencesStore(
    (state) => state.themePreference,
  );
  const setThemePreference = useLeaguePreferencesStore(
    (state) => state.setThemePreference,
  );

  return (
    <div className="flex flex-wrap items-end gap-3">
      <LanguageSelector
        label={t('language.label')}
        locale={activeLocale}
        options={SUPPORTED_LOCALES.map((value) => ({
          value,
          label: t(LOCALE_LABEL_KEYS[value] ?? value),
        }))}
        onChange={switchLocale}
      />
      <ThemeToggle
        label={t('theme.darkMode')}
        value={themePreference}
        onChange={setThemePreference}
      />
    </div>
  );
}
