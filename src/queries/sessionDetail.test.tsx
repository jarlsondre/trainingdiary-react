import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import {
  useAddExerciseUnit,
  useDeleteExerciseUnit,
} from "../mutations/exerciseUnits";
import { useAddSet, useDeleteSet } from "../mutations/sets";
import type { ExerciseUnitInterface, SessionInterface } from "../types/models";
import { useSession } from "./sessions";

jest.mock("../api/sessions");
jest.mock("../api/exerciseUnits");
jest.mock("../api/sets");

import * as unitsApi from "../api/exerciseUnits";
import * as sessionsApi from "../api/sessions";
import * as setsApi from "../api/sets";

let nextId = 100;
let session: SessionInterface;

const makeUnit = (
  over: Partial<ExerciseUnitInterface> = {},
): ExerciseUnitInterface => ({
  id: nextId++,
  set: [],
  exercise_name: "Squat",
  session: 1,
  exercise: 1,
  comment: "",
  ...over,
});

const clone = (s: SessionInterface): SessionInterface =>
  JSON.parse(JSON.stringify(s));

beforeEach(() => {
  nextId = 100;
  session = {
    id: 1,
    exercise_unit: [],
    description: "",
    datetime: "2026-01-01T00:00:00Z",
    user: 1,
    username: "alice",
    liked_by_usernames: [],
    comments: [],
  };

  // Each GET returns an independent snapshot of the current session, so the
  // tests exercise the real invalidation -> refetch path (not shared refs).
  (sessionsApi.getSession as jest.Mock).mockImplementation(() =>
    Promise.resolve(clone(session)),
  );
  (unitsApi.createExerciseUnit as jest.Mock).mockImplementation(
    (data: { exercise: number; session: number }) => {
      const unit = makeUnit({ exercise: data.exercise, session: data.session });
      session.exercise_unit.push(unit);
      return Promise.resolve(unit);
    },
  );
  (unitsApi.deleteExerciseUnit as jest.Mock).mockImplementation(
    (id: number) => {
      session.exercise_unit = session.exercise_unit.filter((u) => u.id !== id);
      return Promise.resolve(id);
    },
  );
  (setsApi.createSet as jest.Mock).mockImplementation(
    (data: {
      exercise_unit: number;
      set_number: number;
      weight: number;
      repetitions: number;
    }) => {
      const set = { id: nextId++, ...data };
      const unit = session.exercise_unit.find(
        (u) => u.id === data.exercise_unit,
      );
      unit?.set.push(set);
      return Promise.resolve(set);
    },
  );
  (setsApi.deleteSet as jest.Mock).mockImplementation((id: number) => {
    for (const unit of session.exercise_unit) {
      unit.set = unit.set.filter((s) => s.id !== id);
    }
    return Promise.resolve(id);
  });
});

const makeWrapper = () => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
};

describe("session detail mutations", () => {
  it("add-exercise appears in the session after the refetch (the prod bug)", async () => {
    const { result } = renderHook(
      () => ({ session: useSession(1), add: useAddExerciseUnit() }),
      { wrapper: makeWrapper() },
    );
    await waitFor(() => expect(result.current.session.isSuccess).toBe(true));
    expect(result.current.session.data?.exercise_unit).toHaveLength(0);

    await act(async () => {
      await result.current.add.mutateAsync({ exercise: 1, session: 1 });
    });

    await waitFor(() =>
      expect(result.current.session.data?.exercise_unit).toHaveLength(1),
    );
  });

  it("adds then deletes a set within an exercise unit", async () => {
    session.exercise_unit.push(makeUnit({ id: 10 }));
    const { result } = renderHook(
      () => ({
        session: useSession(1),
        addSet: useAddSet(),
        delSet: useDeleteSet(),
      }),
      { wrapper: makeWrapper() },
    );
    await waitFor(() => expect(result.current.session.isSuccess).toBe(true));

    await act(async () => {
      await result.current.addSet.mutateAsync({
        exercise_unit: 10,
        set_number: 1,
        weight: 100,
        repetitions: 5,
      });
    });
    let setId = 0;
    await waitFor(() => {
      const sets = result.current.session.data?.exercise_unit[0].set ?? [];
      expect(sets).toHaveLength(1);
      setId = sets[0].id;
    });

    await act(async () => {
      await result.current.delSet.mutateAsync(setId);
    });
    await waitFor(() =>
      expect(result.current.session.data?.exercise_unit[0].set).toHaveLength(0),
    );
  });

  it("deletes an exercise unit", async () => {
    session.exercise_unit.push(makeUnit({ id: 10 }));
    const { result } = renderHook(
      () => ({ session: useSession(1), delUnit: useDeleteExerciseUnit() }),
      { wrapper: makeWrapper() },
    );
    await waitFor(() => expect(result.current.session.isSuccess).toBe(true));
    expect(result.current.session.data?.exercise_unit).toHaveLength(1);

    await act(async () => {
      await result.current.delUnit.mutateAsync(10);
    });
    await waitFor(() =>
      expect(result.current.session.data?.exercise_unit).toHaveLength(0),
    );
  });
});
