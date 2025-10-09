'use client';

import { QueryClient, QueryClientProvider, HydrationBoundary, DehydratedState } from '@tanstack/react-query';
import { useState } from 'react';

export default function ReactQueryProvider({ children, dehydratedState }: { children: React.ReactNode; dehydratedState?: DehydratedState }) {
  const [queryClient] = useState(() => new QueryClient({ defaultOptions: { queries: { staleTime: 6000, refetchOnWindowFocus: true } } }));
  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydratedState}>{children}</HydrationBoundary>
    </QueryClientProvider>
  );
}
