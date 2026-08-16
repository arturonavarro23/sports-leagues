import type { Preview } from '@storybook/react-vite';
import { INITIAL_VIEWPORTS } from 'storybook/viewport';
import { useEffect } from 'react';
import { createPreviewAnnotations } from 'msw-storybook-addon/preview';
import { handlers } from '../src/mocks/handlers';
import { i18next } from '../src/shared/i18n/i18n';
import type { SupportedLocale } from '../src/shared/constants/locales';
import {
  THEME_ATTRIBUTE,
  type ResolvedTheme,
} from '../src/shared/theme/themeTypes';
import '../src/index.css';

const mswAnnotations = createPreviewAnnotations(async () => {
  const { setupWorker } = await import('msw/browser');
  const worker = setupWorker(...handlers);
  await worker.start({ quiet: true, onUnhandledRequest: 'bypass' });
  return worker;
});

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      options: {
        base: { name: 'Base surface', value: '#101826' },
        raised: { name: 'Raised surface', value: '#16202f' },
        light: { name: 'Light', value: '#f1f5f9' },
      },
    },
    viewport: {
      options: {
        ...INITIAL_VIEWPORTS,
        narrow: {
          name: 'Narrow phone',
          styles: { width: '320px', height: '640px' },
          type: 'mobile',
        },
      },
    },
    a11y: {
      test: 'error',
    },
  },
  globalTypes: {
    locale: {
      description: 'Active locale',
      toolbar: {
        icon: 'globe',
        items: [
          { value: 'en', title: 'English' },
          { value: 'es', title: 'Español' },
        ],
        dynamicTitle: true,
      },
    },
    theme: {
      description: 'Resolved theme',
      toolbar: {
        icon: 'paintbrush',
        items: [
          { value: 'dark', title: 'Dark' },
          { value: 'light', title: 'Light' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    backgrounds: { value: 'base' },
    locale: 'en',
    theme: 'dark',
  },
  beforeEach: mswAnnotations.beforeEach,
  decorators: [
    (Story, context) => {
      const locale = context.globals.locale as SupportedLocale;
      const theme = context.globals.theme as ResolvedTheme;

      useEffect(() => {
        void i18next.changeLanguage(locale);
        document.documentElement.lang = locale;
      }, [locale]);

      useEffect(() => {
        document.documentElement.setAttribute(THEME_ATTRIBUTE, theme);
      }, [theme]);

      return (
        <div className="bg-surface-base text-content-primary p-4 font-sans">
          <Story />
        </div>
      );
    },
  ],
};

export default preview;
