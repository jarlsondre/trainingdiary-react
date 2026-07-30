import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { useSession } from "../queries/sessions";
import { useToastStore } from "../stores/toasts";
import type { SessionInterface } from "../types/models";
import { useAddSet } from "./sets";

jest.mock("../api/sessions");
jest.mock("../api/sets");

import * as sessionsApi from "../api/sessions";
import * as setsApi from "../api/sets";

const baseSession = (): SessionInterface => ({
  id: 1,
  exercise_unit: [
    {
      id: 10,
      set: [],
      exercise_name: "Squat",
      session: 1,
      exercise: 1,
      comment: "",
    },
  ],
  description: "",
  datetime: "2026-01-01T00:00:00Z",
  user: 1,
  username: "alice",
  liked_by_usernames: [],
  comments: [],
});

beforeEach(() => {
  useToastStore.setState({ toasts: [] });
  (sessionsApi.getSession as jest.Mock).mockImplementation(() =>
    Promise.resolve(baseSession()),
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

const firstUnitSets = (data: SessionInterface | undefined) =>
  data?.exercise_unit[0].set ?? [];

const NEW_SET = {
  exercise_unit: 10,
  set_number: 1,
  weight: 100,
  repetitions: 5,
};

describe("optimistic set mutations", () => {
  it("shows the new set instantly, before the server responds", async () => {
    // A create that never resolves: any set that appears must be the optimistic
    // one, not a server refetch.
    (setsApi.createSet as jest.Mock).mockImplementation(
      () => new Promise(() => {}),
    );
    const { result } = renderHook(
      () => ({ session: useSession(1), addSet: useAddSet() }),
      { wrapper: makeWrapper() },
    );
    await waitFor(() => expect(result.current.session.isSuccess).toBe(true));
    expect(firstUnitSets(result.current.session.data)).toHaveLength(0);

    act(() => {
      result.current.addSet.mutate(NEW_SET);
    });

    await waitFor(() =>
      expect(firstUnitSets(result.current.session.data)).toHaveLength(1),
    );
    const added = firstUnitSets(result.current.session.data)[0];
    // Negative temp id proves it's the optimistic row (real ids are positive).
    expect(added.id).toBeLessThan(0);
    expect(added.weight).toBe(100);
  });

  it("rolls back and shows a toast if the server rejects", async () => {
    (setsApi.createSet as jest.Mock).mockRejectedValue(new Error("boom"));
    const { result } = renderHook(
      () => ({ session: useSession(1), addSet: useAddSet() }),
      { wrapper: makeWrapper() },
    );
    await waitFor(() => expect(result.current.session.isSuccess).toBe(true));

    await act(async () => {
      await result.current.addSet.mutateAsync(NEW_SET).catch(() => {});
    });

    await waitFor(() =>
      expect(firstUnitSets(result.current.session.data)).toHaveLength(0),
    );
    expect(useToastStore.getState().toasts.length).toBeGreaterThan(0);
    expect(useToastStore.getState().toasts[0].message).toMatch(/couldn't add/i);
  });
});
