import {
  type QueryClient,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createSession,
  deleteSession,
  likeSession,
  updateSession,
} from "../api/sessions";
import { queryKeys } from "../queries/keys";
import { useToastStore } from "../stores/toasts";
import type { AccountInterface, SessionInterface } from "../types/models";
import {
  type FeedData,
  prependSessionToFeed,
  removeSessionFromFeed,
} from "./feedCache";
import { useOptimisticSessionMutation } from "./optimistic";
import { applySessionUpdate } from "./sessionCache";
import { nextTempId } from "./tempId";

// The "sessions" prefix matches every session list (main feed + profile feeds).
const SESSION_LISTS = ["sessions"] as const;

/** Optimistic mutation over the session lists (an infinite query). */
function useOptimisticFeedMutation<V, R>(config: {
  mutationFn: (variables: V) => Promise<R>;
  update: (data: FeedData, variables: V, queryClient: QueryClient) => FeedData;
  errorMessage: string;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: config.mutationFn,
    onMutate: async (variables: V) => {
      await queryClient.cancelQueries({ queryKey: SESSION_LISTS });
      const snapshot = queryClient.getQueriesData({ queryKey: SESSION_LISTS });
      queryClient.setQueriesData<FeedData>(
        { queryKey: SESSION_LISTS },
        (old: FeedData | undefined) =>
          old ? config.update(old, variables, queryClient) : old,
      );
      return { snapshot };
    },
    onError: (_error, _variables, context) => {
      context?.snapshot.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
      useToastStore.getState().addToast(config.errorMessage);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: SESSION_LISTS });
    },
  });
}

export function useAddSession() {
  return useOptimisticFeedMutation<void, SessionInterface>({
    mutationFn: () => createSession({}),
    errorMessage: "Couldn't create the session — please try again.",
    update: (data, _variables, queryClient) => {
      const me = queryClient.getQueryData<AccountInterface>(
        queryKeys.personalUser(),
      );
      // Negative id marks it unsaved; the feed sorts by datetime, so "now" puts
      // it at the top where the real new session will also land.
      const optimisticSession: SessionInterface = {
        id: nextTempId(),
        exercise_unit: [],
        description: "",
        datetime: new Date().toISOString(),
        user: me?.id ?? 0,
        username: me?.username ?? "",
        liked_by_usernames: [],
        comments: [],
      };
      return prependSessionToFeed(data, optimisticSession);
    },
  });
}

export function useDeleteSession() {
  return useOptimisticFeedMutation<number, number>({
    mutationFn: (id) => deleteSession(id),
    errorMessage: "Couldn't delete the session — please try again.",
    update: (data, id) => removeSessionFromFeed(data, id),
  });
}

export function useLikeSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => likeSession(id),
    onSuccess: (session) => {
      queryClient.invalidateQueries({ queryKey: SESSION_LISTS });
      queryClient.invalidateQueries({
        queryKey: queryKeys.session(session.id),
      });
    },
  });
}

export function useUpdateSession() {
  return useOptimisticSessionMutation<
    { id: number; data: Partial<SessionInterface> },
    SessionInterface
  >({
    mutationFn: (vars) => updateSession(vars.id, vars.data),
    errorMessage: "Couldn't save the session — please try again.",
    update: (session, vars) => applySessionUpdate(session, vars.data),
  });
}
