import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { useDeleteSession, useLikeSession } from "../mutations/sessions";
import type { CursorPage, SessionInterface } from "../types/models";
import { useSessions } from "./sessions";

jest.mock("../api/sessions");

import * as sessionsApi from "../api/sessions";

const makeSession = (
  over: Partial<SessionInterface> = {},
): SessionInterface => ({
  id: 1,
  exercise_unit: [],
  description: "",
  datetime: "2026-01-01T00:00:00Z",
  user: 1,
  username: "alice",
  liked_by_usernames: [],
  comments: [],
  ...over,
});

const PAGE_SIZE = 2;
let store: SessionInterface[];

beforeEach(() => {
  store = [
    makeSession({ id: 1 }),
    makeSession({ id: 2 }),
    makeSession({ id: 3 }),
  ];

  // A tiny stateful fake "server": GET returns the current store, paginated by
  // a numeric offset cursor; mutations change the store. This lets the tests
  // verify that a mutation's invalidation actually refetches fresh data.
  (sessionsApi.getSessions as jest.Mock).mockImplementation(
    (cursor: string | null): Promise<CursorPage<SessionInterface>> => {
      const start = cursor ? Number(cursor) : 0;
      const results = store.slice(start, start + PAGE_SIZE);
      const nextStart = start + PAGE_SIZE;
      const next =
        nextStart < store.length
          ? `http://x/session/?cursor=${nextStart}`
          : null;
      return Promise.resolve({ next, previous: null, results });
    },
  );
  (sessionsApi.deleteSession as jest.Mock).mockImplementation((id: number) => {
    store = store.filter((s) => s.id !== id);
    return Promise.resolve(id);
  });
  (sessionsApi.likeSession as jest.Mock).mockImplementation((id: number) => {
    store = store.map((s) =>
      s.id === id ? { ...s, liked_by_usernames: ["bob"] } : s,
    );
    return Promise.resolve(store.find((s) => s.id === id));
  });
});

const makeWrapper = () => {
  const client = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
};

const feedIds = (data: ReturnType<typeof useSessions>["data"]): number[] =>
  (data?.pages.flatMap((page) => page.results) ?? []).map((s) => s.id);

describe("useSessions feed", () => {
  it("loads the first page", async () => {
    const { result } = renderHook(() => useSessions(false), {
      wrapper: makeWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(feedIds(result.current.data)).toEqual([1, 2]);
    expect(result.current.hasNextPage).toBe(true);
  });

  it("paginates with fetchNextPage", async () => {
    const { result } = renderHook(() => useSessions(false), {
      wrapper: makeWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    act(() => {
      void result.current.fetchNextPage();
    });
    await waitFor(() =>
      expect(feedIds(result.current.data)).toEqual([1, 2, 3]),
    );
    expect(result.current.hasNextPage).toBe(false);
  });
});

describe("session mutations invalidate the feed", () => {
  it("delete removes the row after the invalidation refetch", async () => {
    const { result } = renderHook(
      () => ({ feed: useSessions(false), del: useDeleteSession() }),
      { wrapper: makeWrapper() },
    );
    await waitFor(() => expect(result.current.feed.isSuccess).toBe(true));
    expect(feedIds(result.current.feed.data)).toContain(1);

    await act(async () => {
      await result.current.del.mutateAsync(1);
    });

    await waitFor(() =>
      expect(feedIds(result.current.feed.data)).not.toContain(1),
    );
  });

  it("like updates the feed after the invalidation refetch", async () => {
    const { result } = renderHook(
      () => ({ feed: useSessions(false), like: useLikeSession() }),
      { wrapper: makeWrapper() },
    );
    await waitFor(() => expect(result.current.feed.isSuccess).toBe(true));

    await act(async () => {
      await result.current.like.mutateAsync(1);
    });

    await waitFor(() => {
      const liked = (
        result.current.feed.data?.pages.flatMap((p) => p.results) ?? []
      ).find((s) => s.id === 1);
      expect(liked?.liked_by_usernames).toContain("bob");
    });
  });

  it("delete removes the row optimistically, before the server responds", async () => {
    (sessionsApi.deleteSession as jest.Mock).mockImplementation(
      () => new Promise(() => {}),
    );
    const { result } = renderHook(
      () => ({ feed: useSessions(false), del: useDeleteSession() }),
      { wrapper: makeWrapper() },
    );
    await waitFor(() => expect(result.current.feed.isSuccess).toBe(true));
    expect(feedIds(result.current.feed.data)).toContain(1);

    act(() => {
      result.current.del.mutate(1);
    });

    await waitFor(() =>
      expect(feedIds(result.current.feed.data)).not.toContain(1),
    );
  });
});
