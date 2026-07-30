import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getSession, getSessions, getUserSessions } from "../api/sessions";
import type { FeedFilter } from "../types/models";
import { queryKeys } from "./keys";
import { cursorFromNextLink } from "./pagination";

/** The main session feed, filtered by "all" / "personal" / "following". */
export function useSessions(feed: FeedFilter) {
  return useInfiniteQuery({
    queryKey: queryKeys.sessions(feed),
    queryFn: ({ pageParam }) => getSessions(pageParam, feed),
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

/** A given user's sessions (their profile feed). */
export function useUserSessions(username: string) {
  return useInfiniteQuery({
    queryKey: queryKeys.userSessions(username),
    queryFn: ({ pageParam }) => getUserSessions(username, pageParam),
    initialPageParam: "" as string | null,
    getNextPageParam: (lastPage) => cursorFromNextLink(lastPage.next),
    enabled: username.length > 0,
  });
}
