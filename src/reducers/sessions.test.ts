import * as Actions from "../actions/types";
import type {
  ExerciseUnitInterface,
  SessionInterface,
  SetInterface,
} from "../types/models";
import type { SessionsState } from "./sessions";
import sessionReducer from "./sessions";

const makeSet = (overrides: Partial<SetInterface> = {}): SetInterface => ({
  id: 1,
  weight: 100,
  repetitions: 5,
  set_number: 1,
  exercise_unit: 10,
  ...overrides,
});

const makeExerciseUnit = (
  overrides: Partial<ExerciseUnitInterface> = {},
): ExerciseUnitInterface => ({
  id: 10,
  set: [],
  exercise_name: "Squat",
  session: 100,
  exercise: 1,
  comment: "",
  ...overrides,
});

const makeSession = (
  overrides: Partial<SessionInterface> = {},
): SessionInterface => ({
  id: 100,
  exercise_unit: [],
  description: "",
  datetime: "2026-07-14T12:00:00Z",
  user: 1,
  username: "jarl",
  liked_by_usernames: [],
  comments: [],
  ...overrides,
});

const initial = (): SessionsState =>
  sessionReducer(undefined, { type: "@@INIT" });

const page = (results: SessionInterface[], next: string | null = null) => ({
  next,
  previous: null,
  results,
});

describe("RETRIEVE_SESSIONS", () => {
  it("stores the fetched page and extracts the cursor from the next link", () => {
    const state = sessionReducer(initial(), {
      type: Actions.RETRIEVE_SESSIONS,
      payload: page([makeSession()], "http://x/session/?cursor=abc123"),
      replaceStore: false,
    });
    expect(state.sessionList).toHaveLength(1);
    expect(state.cursor).toBe("abc123");
    expect(state.moreToLoad).toBe(true);
  });

  it("flags the end of pagination when there is no next link", () => {
    const state = sessionReducer(initial(), {
      type: Actions.RETRIEVE_SESSIONS,
      payload: page([makeSession()]),
      replaceStore: false,
    });
    expect(state.moreToLoad).toBe(false);
    expect(state.cursor).toBeNull();
  });

  it("merges new pages without duplicating already-loaded sessions", () => {
    const first = sessionReducer(initial(), {
      type: Actions.RETRIEVE_SESSIONS,
      payload: page([makeSession({ id: 1 }), makeSession({ id: 2 })]),
      replaceStore: false,
    });
    const second = sessionReducer(first, {
      type: Actions.RETRIEVE_SESSIONS,
      payload: page([makeSession({ id: 2 }), makeSession({ id: 3 })]),
      replaceStore: false,
    });
    expect(second.sessionList.map((s) => s.id)).toEqual([1, 2, 3]);
  });

  it("replaces the list when replaceStore is set (filter change)", () => {
    const first = sessionReducer(initial(), {
      type: Actions.RETRIEVE_SESSIONS,
      payload: page([makeSession({ id: 1 })]),
      replaceStore: false,
    });
    const replaced = sessionReducer(first, {
      type: Actions.RETRIEVE_SESSIONS,
      payload: page([makeSession({ id: 9 })]),
      replaceStore: true,
    });
    expect(replaced.sessionList.map((s) => s.id)).toEqual([9]);
  });
});

describe("session CRUD actions", () => {
  it("appends the created session on ADD_SESSION_SUCCESS", () => {
    const state = sessionReducer(initial(), {
      type: Actions.ADD_SESSION_SUCCESS,
      payload: makeSession({ id: 7 }),
    });
    expect(state.sessionList.map((s) => s.id)).toEqual([7]);
  });

  it("removes the session on DELETE_SESSION", () => {
    const withSessions: SessionsState = {
      ...initial(),
      sessionList: [makeSession({ id: 1 }), makeSession({ id: 2 })],
    };
    const state = sessionReducer(withSessions, {
      type: Actions.DELETE_SESSION,
      payload: 1,
    });
    expect(state.sessionList.map((s) => s.id)).toEqual([2]);
  });

  it("updates both the list and the selected session on UPDATE_SESSION_SUCCESS", () => {
    const session = makeSession({ description: "old" });
    const withSelected: SessionsState = {
      ...initial(),
      sessionList: [session],
      selectedSession: { ...session, isLoading: false },
    };
    const state = sessionReducer(withSelected, {
      type: Actions.UPDATE_SESSION_SUCCESS,
      payload: makeSession({ description: "new" }),
    });
    expect(state.selectedSession.description).toBe("new");
    expect(state.sessionList[0].description).toBe("new");
  });
});

describe("set actions on the selected session", () => {
  const baseState = (): SessionsState => {
    const unit = makeExerciseUnit({ set: [makeSet({ id: 1, set_number: 1 })] });
    const session = makeSession({ exercise_unit: [unit] });
    return {
      ...initial(),
      sessionList: [session],
      selectedSession: { ...session, isLoading: false },
    };
  };

  it("ADD_SET appends the set to its exercise unit", () => {
    const state = sessionReducer(baseState(), {
      type: Actions.ADD_SET,
      payload: makeSet({ id: 2, set_number: 2 }),
    });
    const sets = state.selectedSession.exercise_unit?.[0].set ?? [];
    expect(sets.map((s) => s.id)).toEqual([1, 2]);
  });

  it("UPDATE_SET replaces the matching set", () => {
    const state = sessionReducer(baseState(), {
      type: Actions.UPDATE_SET,
      payload: makeSet({ id: 1, weight: 120 }),
    });
    const sets = state.selectedSession.exercise_unit?.[0].set ?? [];
    expect(sets).toHaveLength(1);
    expect(sets[0].weight).toBe(120);
  });

  it("DELETE_SET removes the matching set", () => {
    const state = sessionReducer(baseState(), {
      type: Actions.DELETE_SET,
      payload: makeSet({ id: 1 }),
    });
    expect(state.selectedSession.exercise_unit?.[0].set).toHaveLength(0);
  });

  it("keeps the session list in sync with the selected session", () => {
    const state = sessionReducer(baseState(), {
      type: Actions.ADD_SET,
      payload: makeSet({ id: 2, set_number: 2 }),
    });
    const listed = state.sessionList.find((s) => s.id === 100);
    expect(listed?.exercise_unit[0].set.map((s) => s.id)).toEqual([1, 2]);
  });
});

describe("exercise unit actions", () => {
  it("DELETE_EXERCISE_UNIT removes the unit from the selected session", () => {
    const unit = makeExerciseUnit({ id: 10 });
    const session = makeSession({ exercise_unit: [unit] });
    const state = sessionReducer(
      {
        ...initial(),
        sessionList: [session],
        selectedSession: { ...session, isLoading: false },
      },
      { type: Actions.DELETE_EXERCISE_UNIT, payload: 10 },
    );
    expect(state.selectedSession.exercise_unit).toHaveLength(0);
  });

  it("UPDATE_EXERCISE_UNIT swaps in the updated unit", () => {
    const unit = makeExerciseUnit({ id: 10, comment: "old" });
    const session = makeSession({ exercise_unit: [unit] });
    const state = sessionReducer(
      {
        ...initial(),
        sessionList: [session],
        selectedSession: { ...session, isLoading: false },
      },
      {
        type: Actions.UPDATE_EXERCISE_UNIT,
        payload: makeExerciseUnit({ id: 10, comment: "new" }),
      },
    );
    expect(state.selectedSession.exercise_unit?.[0].comment).toBe("new");
  });
});

describe("profile sessions", () => {
  it("FETCH_USER_SESSIONS fills profileSessions with pagination state", () => {
    const state = sessionReducer(initial(), {
      type: Actions.FETCH_USER_SESSIONS,
      payload: page(
        [makeSession()],
        "http://x/sessions/user/jarl/?cursor=next1",
      ),
      replaceStore: true,
      username: "jarl",
    });
    expect(state.profileSessions.results).toHaveLength(1);
    expect(state.profileSessions.cursor).toBe("next1");
    expect(state.profileSessions.username).toBe("jarl");
    expect(state.profileSessions.moreToLoad).toBe(true);
  });

  it("UPDATE_PROFILE_USERNAME resets pagination for the new profile", () => {
    const state = sessionReducer(initial(), {
      type: Actions.UPDATE_PROFILE_USERNAME,
      payload: "someone-else",
    });
    expect(state.profileSessions.username).toBe("someone-else");
    expect(state.profileSessions.cursor).toBe("");
    expect(state.profileSessions.moreToLoad).toBe(true);
  });
});

describe("unknown actions", () => {
  it("returns the state unchanged", () => {
    const state = initial();
    expect(sessionReducer(state, { type: "SOMETHING_ELSE" })).toBe(state);
  });
});
