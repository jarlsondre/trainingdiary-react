import { useInfiniteQuery } from "@tanstack/react-query";
import { getSessions } from "../api/sessions";
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
