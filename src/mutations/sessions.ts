import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSession, deleteSession, likeSession } from "../api/sessions";
import { queryKeys } from "../queries/keys";

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
