'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import { PropsWithChildren } from 'react';

const queryClient = new QueryClient();

const Providers = ({ children }: PropsWithChildren) => {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>{children}</SessionProvider>
    </QueryClientProvider>
  );
};

export default Providers;
