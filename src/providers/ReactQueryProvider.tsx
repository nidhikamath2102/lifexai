'use client';

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export function ReactQueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 1,
        staleTime: 0, // Set to 0 to always refetch
        refetchOnMount: true,
      },
      mutations: {
        onError: (err) => {
          console.error('Mutation error:', err);
        },
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
