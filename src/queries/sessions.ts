import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getSession, getSessions } from "../api/sessions";
import { queryKeys } from "./keys";
import { cursorFromNextLink } from "./pagination";

/** The main session feed (own + followed users, or personal-only). */
export function useSessions(filterPersonal: boolean) {
  return useInfiniteQuery({
    queryKey: queryKeys.sessions(filterPersonal),
    queryFn: ({ pageParam }) => getSessions(pageParam, filterPersonal),
    initialPageParam: "" as string | null,
    getNextPageParam: (lastPage) => cursorFromNextLink(lastPage.next),
  });
}

/** A single session with its nested exercise units, sets and comments. */
export function useSession(id: number) {
  return useQuery({
    queryKey: queryKeys.session(id),
    queryFn: () => getSession(id),
    enabled: Number.isFinite(id) && id > 0,
  });
}
