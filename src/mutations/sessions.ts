import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createSession,
  deleteSession,
  likeSession,
  updateSession,
} from "../api/sessions";
import { queryKeys } from "../queries/keys";
import type { SessionInterface } from "../types/models";
import { useOptimisticSessionMutation } from "./optimistic";

// The "sessions" prefix matches every session list (main feed + profile feeds),
// so a create/delete/like refreshes them all.
const SESSION_LISTS = ["sessions"] as const;

export function useAddSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => createSession({}),
    onSuccess: () => qc.invalidateQueries({ queryKey: SESSION_LISTS }),
  });
}

export function useDeleteSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteSession(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: SESSION_LISTS }),
  });
}

export function useLikeSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => likeSession(id),
    onSuccess: (session) => {
      qc.invalidateQueries({ queryKey: SESSION_LISTS });
      qc.invalidateQueries({ queryKey: queryKeys.session(session.id) });
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
    update: (session, vars) => ({ ...session, ...vars.data }),
  });
}
