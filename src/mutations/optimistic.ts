import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToastStore } from "../stores/toasts";
import type { SessionInterface } from "../types/models";

interface OptimisticSessionConfig<V, R> {
  mutationFn: (variables: V) => Promise<R>;
  /** Pure patch applied to each cached session detail for instant feedback. */
  update: (session: SessionInterface, variables: V) => SessionInterface;
  /** Shown (as a dismissible toast) if the server rejects and we roll back. */
  errorMessage: string;
}

/**
 * A mutation that updates the open session's cache instantly (optimistic),
 * rolls back and toasts on failure, then quietly reconciles with the server.
 *
 * The optimistic write is localized to one place and can never get stuck wrong:
 * onError restores the exact prior cache, and onSettled always refetches the
 * real server state.
 */
export function useOptimisticSessionMutation<V, R>(
  config: OptimisticSessionConfig<V, R>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: config.mutationFn,
    onMutate: async (variables: V) => {
      // Stop any in-flight refetch from clobbering the optimistic write.
      await queryClient.cancelQueries({ queryKey: ["session"] });
      const snapshot = queryClient.getQueriesData<SessionInterface>({
        queryKey: ["session"],
      });
      queryClient.setQueriesData<SessionInterface>(
        { queryKey: ["session"] },
        (old: SessionInterface | undefined) =>
          old ? config.update(old, variables) : old,
      );
      return { snapshot };
    },
    onError: (_error, _variables, context) => {
      // Restore exactly what was on screen, then explain why it reverted.
      context?.snapshot.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
      useToastStore.getState().addToast(config.errorMessage);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["session"] });
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
  });
}
