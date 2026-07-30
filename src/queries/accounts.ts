import { useQuery } from "@tanstack/react-query";
import { getAccount, getPersonalUser } from "../api/accounts";
import { useAppSelector } from "../hooks";
import { queryKeys } from "./keys";

/**
 * The logged-in account. The auth gate is still Redux during the migration and
 * becomes the Zustand auth store in the final phase (this is the one temporary
 * Redux reference in the query layer).
 */
export function usePersonalUser() {
  const isAuthenticated = useAppSelector(
    (state) => state.authentication.isAuthenticated,
  );
  return useQuery({
    queryKey: queryKeys.personalUser(),
    queryFn: getPersonalUser,
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5,
  });
}

/** Any account viewed by username (a profile page). */
export function useAccount(username: string) {
  return useQuery({
    queryKey: queryKeys.account(username),
    queryFn: () => getAccount(username),
    enabled: username.length > 0,
  });
}
