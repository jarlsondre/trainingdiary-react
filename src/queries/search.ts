import { useInfiniteQuery } from "@tanstack/react-query";
import { searchAccounts } from "../api/accounts";
import { queryKeys } from "./keys";
import { cursorFromNextLink } from "./pagination";

/** User search by term (empty term stays idle). */
export function useUserSearch(term: string) {
  return useInfiniteQuery({
    queryKey: queryKeys.userSearch(term),
    queryFn: ({ pageParam }) => searchAccounts(pageParam, term),
    initialPageParam: "" as string | null,
    getNextPageParam: (lastPage) => cursorFromNextLink(lastPage.next),
    enabled: term.length > 0,
  });
}
