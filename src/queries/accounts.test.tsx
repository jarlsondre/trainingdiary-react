import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { useFollow, useUnfollow } from "../mutations/accounts";
import type { AccountInterface } from "../types/models";
import { useAccount } from "./accounts";
import { useUserSearch } from "./search";

jest.mock("../api/accounts");

import * as accountsApi from "../api/accounts";

let account: AccountInterface;

beforeEach(() => {
  account = {
    id: 2,
    username: "bob",
    email: "",
    bio: null,
    first_name: "",
    last_name: "",
    unit_system: "kg",
    followers: [],
    following: [],
  };
  (accountsApi.getAccount as jest.Mock).mockImplementation(() =>
    Promise.resolve(JSON.parse(JSON.stringify(account))),
  );
  (accountsApi.followAccount as jest.Mock).mockImplementation(() => {
    account.followers.push({ id: 1, username: "me" });
    return Promise.resolve();
  });
  (accountsApi.unfollowAccount as jest.Mock).mockImplementation(() => {
    account.followers = account.followers.filter((f) => f.username !== "me");
    return Promise.resolve();
  });
  (accountsApi.searchAccounts as jest.Mock).mockImplementation(() =>
    Promise.resolve({
      next: null,
      previous: null,
      results: [{ id: 2, username: "bob" }],
    }),
  );
});

const makeWrapper = () => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
};

describe("follow/unfollow", () => {
  it("follow invalidates the account so followers refetch", async () => {
    const { result } = renderHook(
      () => ({ account: useAccount("bob"), follow: useFollow() }),
      { wrapper: makeWrapper() },
    );
    await waitFor(() => expect(result.current.account.isSuccess).toBe(true));
    expect(result.current.account.data?.followers).toHaveLength(0);

    await act(async () => {
      await result.current.follow.mutateAsync(2);
    });

    await waitFor(() =>
      expect(result.current.account.data?.followers).toHaveLength(1),
    );
  });

  it("unfollow removes the follower after refetch", async () => {
    account.followers.push({ id: 1, username: "me" });
    const { result } = renderHook(
      () => ({ account: useAccount("bob"), unfollow: useUnfollow() }),
      { wrapper: makeWrapper() },
    );
    await waitFor(() => expect(result.current.account.isSuccess).toBe(true));
    expect(result.current.account.data?.followers).toHaveLength(1);

    await act(async () => {
      await result.current.unfollow.mutateAsync(2);
    });

    await waitFor(() =>
      expect(result.current.account.data?.followers).toHaveLength(0),
    );
  });
});

describe("useUserSearch", () => {
  it("returns matching users for a term", async () => {
    const { result } = renderHook(() => useUserSearch("bo"), {
      wrapper: makeWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    const users = result.current.data?.pages.flatMap((p) => p.results) ?? [];
    expect(users.map((u) => u.username)).toContain("bob");
  });

  it("stays idle for an empty term", () => {
    const { result } = renderHook(() => useUserSearch(""), {
      wrapper: makeWrapper(),
    });
    expect(result.current.fetchStatus).toBe("idle");
    expect(result.current.data).toBeUndefined();
  });
});
