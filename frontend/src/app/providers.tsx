'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'; // Optional: for dev tools

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Optional: React Query Devtools - only for development */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}