/**
 * Reads the cursor token out of a DRF CursorPagination `next` link.
 * Returns null at the end of the list (when `next` is null or has no cursor).
 * Used as the `getNextPageParam` for every `useInfiniteQuery`.
 */
export const cursorFromNextLink = (next: string | null): string | null => {
  if (!next) return null;
  return new URLSearchParams(next.split("?")[1]).get("cursor");
};
