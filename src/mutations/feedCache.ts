import type { InfiniteData } from "@tanstack/react-query";
import type { CursorPage, SessionInterface } from "../types/models";

/** A session list (feed or profile feed) as TanStack Query stores it. */
export type FeedData = InfiniteData<CursorPage<SessionInterface>>;

/** Pure optimistic patches on a paginated session list. */

export const prependSessionToFeed = (
  data: FeedData,
  session: SessionInterface,
): FeedData => {
  const [firstPage, ...restPages] = data.pages;
  const newFirstPage: CursorPage<SessionInterface> = firstPage
    ? { ...firstPage, results: [session, ...firstPage.results] }
    : { next: null, previous: null, results: [session] };
  return { ...data, pages: [newFirstPage, ...restPages] };
};

export const removeSessionFromFeed = (
  data: FeedData,
  id: number,
): FeedData => ({
  ...data,
  pages: data.pages.map((page) => ({
    ...page,
    results: page.results.filter((session) => session.id !== id),
  })),
});
