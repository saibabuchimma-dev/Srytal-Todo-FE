import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MantineProvider } from './MantineProvider';
import { Toaster } from 'sonner';
import type { ReactNode } from 'react';

interface AppProvidersProps {
  children: ReactNode;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30_000,
      gcTime: 5 * 60_000,
    },
  },
});

export default function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider defaultColorScheme="light">
        <Toaster
          position="top-right"
          richColors
          closeButton
          expand
          visibleToasts={4}
          toastOptions={{
            style: { borderRadius: '12px' },
            classNames: {
              toast: 'glass-strong',
              description: 'text-sm',
            },
          }}
        />
        {children}
      </MantineProvider>
    </QueryClientProvider>
  );
}
