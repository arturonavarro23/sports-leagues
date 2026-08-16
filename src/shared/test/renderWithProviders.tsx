import type { ReactElement, ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { render, type RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

export function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: Infinity },
      mutations: { retry: false },
    },
  });
}

interface RenderWithProvidersOptions {
  initialEntries?: string[];
  path?: string;
  queryClient?: QueryClient;
}

export interface RenderWithProvidersResult extends RenderResult {
  user: ReturnType<typeof userEvent.setup>;
  queryClient: QueryClient;
  router: ReturnType<typeof createMemoryRouter>;
}

export function renderWithProviders(
  ui: ReactElement,
  {
    initialEntries = ['/'],
    path = '*',
    queryClient = createTestQueryClient(),
  }: RenderWithProvidersOptions = {},
): RenderWithProvidersResult {
  const router = createMemoryRouter([{ path, element: ui }], {
    initialEntries,
  });

  const result = render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );

  return {
    ...result,
    user: userEvent.setup(),
    queryClient,
    router,
  };
}

export function createQueryWrapper(queryClient = createTestQueryClient()) {
  return function QueryWrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}
