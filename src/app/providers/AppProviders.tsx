import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MantineProvider } from '@mantine/core';
import { Toaster } from 'sonner';
import { theme } from '@/theme';
import type { ReactNode } from 'react';

interface AppProvidersProps {
  children: ReactNode;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      // Treat data as fresh for 30s so revisiting a screen (or remounting a
      // component) doesn't trigger a redundant network refetch every time.
      staleTime: 30_000,
      // Keep unused query data cached for 5 min before garbage collection.
      gcTime: 5 * 60_000,
    },
  },
});

export default function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme} defaultColorScheme="light">
        <Toaster
          position="top-right"
          richColors
          closeButton
          expand
          visibleToasts={4}
          toastOptions={{
            style: { borderRadius: '10px' },
          }}
        />
        {children}
      </MantineProvider>
    </QueryClientProvider>
  );
}
