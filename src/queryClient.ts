import { QueryClient } from "@tanstack/react-query";

// Shared TanStack Query client. Portable: no DOM/router imports, so this file
// carries over unchanged to a future React Native app.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data is considered fresh for 30s before a background refetch is allowed.
      staleTime: 30_000,
      retry: 1,
      // A gym-logging app doesn't need aggressive focus refetching.
      refetchOnWindowFocus: false,
    },
  },
});
