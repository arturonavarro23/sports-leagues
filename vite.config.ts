/// <reference types="vitest/config" />
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';

const srcPath = fileURLToPath(new URL('./src', import.meta.url));
const storybookPath = fileURLToPath(new URL('./.storybook', import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': srcPath,
    },
  },
  build: {
    assetsDir: 'assets',
    sourcemap: false,
  },
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          environment: 'jsdom',
          globals: true,
          setupFiles: ['./src/shared/test/setup.ts'],
          include: ['src/**/*.test.{ts,tsx}'],
          css: true,
          // Testing Library's findBy* defaults to 1s, which is tight for the
          // lazily loaded route under a fully parallel run.
          testTimeout: 10_000,
        },
      },
      {
        extends: true,
        plugins: [storybookTest({ configDir: storybookPath })],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
});
