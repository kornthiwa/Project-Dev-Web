"use client";

import { QueryClient, QueryClientProvider } from "react-query";

const querylient = new QueryClient();

export const ReactQueryClientProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => <QueryClientProvider client={querylient}>{children}</QueryClientProvider>;
