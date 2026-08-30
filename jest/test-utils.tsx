/* eslint-disable react-refresh/only-export-components */
import { render, type RenderOptions } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import type { ReactElement, ReactNode } from 'react';

/** A QueryClient with retries/logging disabled — deterministic for tests. */
export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0, staleTime: 0 },
      mutations: { retry: false },
    },
  });
}

interface ProviderOptions extends Omit<RenderOptions, 'wrapper'> {
  /** Initial history entry when a router is included. */
  route?: string;
  /** Provide a shared QueryClient (else a fresh one is created). */
  queryClient?: QueryClient;
  /** Wrap in a MemoryRouter (default true). Set false for components that bring their own router. */
  withRouter?: boolean;
}

/**
 * Render a component inside the app's providers (Mantine + React Query + Router).
 * Returns the RTL result plus the QueryClient used.
 */
export function renderWithProviders(ui: ReactElement, options: ProviderOptions = {}) {
  const {
    route = '/',
    queryClient = createTestQueryClient(),
    withRouter = true,
    ...rtlOptions
  } = options;

  function Wrapper({ children }: { children: ReactNode }) {
    const inner = (
      <QueryClientProvider client={queryClient}>
        <MantineProvider>{children}</MantineProvider>
      </QueryClientProvider>
    );
    return withRouter ? (
      <MemoryRouter initialEntries={[route]}>{inner}</MemoryRouter>
    ) : (
      inner
    );
  }

  return { queryClient, ...render(ui, { wrapper: Wrapper, ...rtlOptions }) };
}

/**
 * Wrapper factory for renderHook — provides a QueryClientProvider (and shares the
 * given client so tests can inspect the cache).
 */
export function hookWrapper(queryClient: QueryClient = createTestQueryClient()) {
  function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  }
  return { wrapper: Wrapper, queryClient };
}

// Re-export everything from RTL so specs import from one place.
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
