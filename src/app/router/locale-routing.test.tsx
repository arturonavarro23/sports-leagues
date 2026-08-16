import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { createTestQueryClient } from '@/shared/test/renderWithProviders';
import { STORAGE_KEYS } from '@/shared/constants/storage';
import { DEFAULT_LOCALE } from '@/shared/constants/locales';
import { i18next } from '@/shared/i18n/i18n';
import { routeConfig } from './router';

function renderRouter(initialEntries: string[]) {
  const router = createMemoryRouter(routeConfig, { initialEntries });
  const queryClient = createTestQueryClient();

  render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );

  return router;
}

function stubBrowserLanguages(languages: string[]) {
  vi.spyOn(window.navigator, 'languages', 'get').mockReturnValue(languages);
}

describe('locale routing', () => {
  beforeEach(async () => {
    // i18next is a module-level singleton, so a previous test's language would
    // otherwise leak into routes that never run the locale sync.
    await i18next.changeLanguage(DEFAULT_LOCALE);
  });

  afterEach(async () => {
    vi.restoreAllMocks();
    window.localStorage.clear();
    // Awaited so any changeLanguage the unmounted route left in flight settles
    // before the next test renders.
    await i18next.changeLanguage(DEFAULT_LOCALE);
  });

  it('activates English at /en/leagues', async () => {
    renderRouter(['/en/leagues']);

    await screen.findByRole('heading', { name: 'Sports Leagues' });
    expect(i18next.language).toBe('en');
    expect(document.documentElement.lang).toBe('en');
  });

  it('activates Spanish at /es/leagues', async () => {
    renderRouter(['/es/leagues']);

    await screen.findByRole('heading', { name: 'Ligas Deportivas' });
    expect(i18next.language).toBe('es');
    expect(document.documentElement.lang).toBe('es');
  });

  it('treats /es/ligas as an unsupported route', async () => {
    renderRouter(['/es/ligas']);

    expect(
      await screen.findByRole('heading', { name: /page not found/i }),
    ).toBeInTheDocument();
  });

  it('treats an unsupported locale segment as a not-found route', async () => {
    renderRouter(['/fr/leagues']);

    expect(
      await screen.findByRole('heading', { name: /page not found/i }),
    ).toBeInTheDocument();
  });

  it('redirects / using the stored locale', async () => {
    window.localStorage.setItem(STORAGE_KEYS.language, 'es');

    const router = renderRouter(['/']);

    await screen.findByRole('heading', { name: 'Ligas Deportivas' });
    expect(router.state.location.pathname).toBe('/es/leagues');
  });

  it('redirects / using the browser locale when nothing is stored', async () => {
    stubBrowserLanguages(['es-MX', 'es']);

    const router = renderRouter(['/']);

    await screen.findByRole('heading', { name: 'Ligas Deportivas' });
    expect(router.state.location.pathname).toBe('/es/leagues');
  });

  it('redirects / to English when nothing is stored or supported by the browser', async () => {
    stubBrowserLanguages(['fr-FR', 'fr']);

    const router = renderRouter(['/']);

    await screen.findByRole('heading', { name: 'Sports Leagues' });
    expect(router.state.location.pathname).toBe('/en/leagues');
  });

  it('lets a valid pathname locale override a conflicting stored value', async () => {
    window.localStorage.setItem(STORAGE_KEYS.language, 'en');

    const router = renderRouter(['/es/leagues']);

    await screen.findByRole('heading', { name: 'Ligas Deportivas' });
    expect(router.state.location.pathname).toBe('/es/leagues');
    expect(i18next.language).toBe('es');
    expect(window.localStorage.getItem(STORAGE_KEYS.language)).toBe('es');
  });

  it('updates document.documentElement.lang on browser back/forward', async () => {
    const router = createMemoryRouter(routeConfig, {
      initialEntries: ['/en/leagues', '/es/leagues'],
      initialIndex: 1,
    });
    const queryClient = createTestQueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>,
    );

    await screen.findByRole('heading', { name: 'Ligas Deportivas' });
    expect(document.documentElement.lang).toBe('es');

    await act(async () => {
      await router.navigate(-1);
    });
    expect(router.state.location.pathname).toBe('/en/leagues');
    expect(document.documentElement.lang).toBe('en');

    await act(async () => {
      await router.navigate(1);
    });
    expect(router.state.location.pathname).toBe('/es/leagues');
    expect(document.documentElement.lang).toBe('es');
  });

  describe('when localStorage throws', () => {
    beforeEach(() => {
      vi.spyOn(window, 'localStorage', 'get').mockImplementation(() => {
        throw new Error('localStorage is unavailable');
      });
    });

    it('does not crash and falls back to the browser locale', async () => {
      stubBrowserLanguages(['es-ES']);

      const router = renderRouter(['/']);

      await screen.findByRole('heading', { name: 'Ligas Deportivas' });
      expect(router.state.location.pathname).toBe('/es/leagues');
    });
  });
});

describe('locale root without a segment', () => {
  beforeEach(async () => {
    await i18next.changeLanguage(DEFAULT_LOCALE);
  });

  it('completes /es to /es/leagues', async () => {
    const router = renderRouter(['/es']);

    await screen.findByRole('heading', { name: 'Ligas Deportivas' });
    expect(router.state.location.pathname).toBe('/es/leagues');
  });

  it('completes /en to /en/leagues', async () => {
    const router = renderRouter(['/en']);

    await screen.findByRole('heading', { name: 'Sports Leagues' });
    expect(router.state.location.pathname).toBe('/en/leagues');
  });

  it('preserves the query string while completing the path', async () => {
    const router = renderRouter(['/es?search=premier&league=4328']);

    await screen.findByRole('heading', { name: 'Ligas Deportivas' });
    expect(router.state.location.pathname).toBe('/es/leagues');
    expect(router.state.location.search).toBe('?search=premier&league=4328');
  });

  it('keeps an unsupported locale root a not-found route', async () => {
    renderRouter(['/fr']);

    expect(
      await screen.findByRole('heading', { name: /page not found/i }),
    ).toBeInTheDocument();
  });
});
