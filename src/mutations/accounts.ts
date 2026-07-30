import { useMutation, useQueryClient } from "@tanstack/react-query";
import { followAccount, unfollowAccount, updateAccount } from "../api/accounts";
import { queryKeys } from "../queries/keys";
import type { AccountInterface } from "../types/models";

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { id: number; data: Partial<AccountInterface> }) =>
      updateAccount(vars.id, vars.data),
    onSuccess: (account) => {
      qc.invalidateQueries({ queryKey: queryKeys.personalUser() });
      qc.invalidateQueries({ queryKey: queryKeys.account(account.username) });
    },
  });
}

// Follow/unfollow change the logged-in user's following list and the target
// account's followers, so both the personal user and every account are refreshed.
export function useFollow() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => followAccount(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.personalUser() });
      qc.invalidateQueries({ queryKey: ["account"] });
    },
  });
}

export function useUnfollow() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => unfollowAccount(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.personalUser() });
      qc.invalidateQueries({ queryKey: ["account"] });
    },
  });
}
