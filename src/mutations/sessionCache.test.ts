import type {
  ExerciseUnitInterface,
  SessionCommentInterface,
  SessionInterface,
  SetInterface,
} from "../types/models";
import {
  addCommentToSession,
  addExerciseUnitToSession,
  addSetToSession,
  applySessionUpdate,
  removeCommentFromSession,
  removeExerciseUnitFromSession,
  removeSetFromSession,
  updateCommentInSession,
  updateExerciseUnitInSession,
  updateSetInSession,
} from "./sessionCache";

const makeSet = (overrides: Partial<SetInterface> = {}): SetInterface => ({
  id: 1,
  weight: 100,
  repetitions: 5,
  set_number: 1,
  exercise_unit: 10,
  ...overrides,
});

const makeUnit = (
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

describe("addSetToSession", () => {
  it("appends the set to the matching exercise unit with the temp id", () => {
    const session = makeSession({ exercise_unit: [makeUnit({ id: 10 })] });
    const result = addSetToSession(
      session,
      {
        weight: 80,
        repetitions: 8,
        set_number: 1,
        exercise_unit: 10,
      },
      -5,
    );
    expect(result.exercise_unit[0].set).toEqual([
      { weight: 80, repetitions: 8, set_number: 1, exercise_unit: 10, id: -5 },
    ]);
  });

  it("leaves non-matching units untouched", () => {
    const session = makeSession({
      exercise_unit: [makeUnit({ id: 10 }), makeUnit({ id: 11 })],
    });
    const result = addSetToSession(
      session,
      {
        weight: 80,
        repetitions: 8,
        set_number: 1,
        exercise_unit: 10,
      },
      -5,
    );
    expect(result.exercise_unit[1].set).toEqual([]);
  });

  it("does not mutate the original session", () => {
    const session = makeSession({ exercise_unit: [makeUnit({ id: 10 })] });
    addSetToSession(
      session,
      { weight: 1, repetitions: 1, set_number: 1, exercise_unit: 10 },
      -5,
    );
    expect(session.exercise_unit[0].set).toEqual([]);
  });
});

describe("updateSetInSession", () => {
  it("merges the update into the matching set", () => {
    const session = makeSession({
      exercise_unit: [
        makeUnit({ id: 10, set: [makeSet({ id: 1, weight: 100 })] }),
      ],
    });
    const result = updateSetInSession(session, { id: 1, weight: 120 });
    expect(result.exercise_unit[0].set[0].weight).toBe(120);
    expect(result.exercise_unit[0].set[0].repetitions).toBe(5);
  });

  it("leaves other sets untouched", () => {
    const session = makeSession({
      exercise_unit: [
        makeUnit({
          id: 10,
          set: [makeSet({ id: 1 }), makeSet({ id: 2, weight: 50 })],
        }),
      ],
    });
    const result = updateSetInSession(session, { id: 1, weight: 120 });
    expect(result.exercise_unit[0].set[1].weight).toBe(50);
  });
});

describe("removeSetFromSession", () => {
  it("removes the set with the given id from every unit", () => {
    const session = makeSession({
      exercise_unit: [
        makeUnit({ id: 10, set: [makeSet({ id: 1 }), makeSet({ id: 2 })] }),
      ],
    });
    const result = removeSetFromSession(session, 1);
    expect(result.exercise_unit[0].set.map((s) => s.id)).toEqual([2]);
  });
});

describe("addExerciseUnitToSession", () => {
  it("appends a unit with an id above the current max so it sorts last", () => {
    const session = makeSession({
      exercise_unit: [makeUnit({ id: 10 }), makeUnit({ id: 14 })],
    });
    const result = addExerciseUnitToSession(session, {
      exercise: 7,
      sessionId: 100,
      exerciseName: "Deadlift",
    });
    expect(result.exercise_unit).toHaveLength(3);
    const added = result.exercise_unit[2];
    expect(added.id).toBe(15);
    expect(added.exercise).toBe(7);
    expect(added.exercise_name).toBe("Deadlift");
    expect(added.session).toBe(100);
    expect(added.set).toEqual([]);
  });

  it("starts ids at 1 when the session has no units", () => {
    const session = makeSession({ exercise_unit: [] });
    const result = addExerciseUnitToSession(session, {
      exercise: 7,
      sessionId: 100,
      exerciseName: "Deadlift",
    });
    expect(result.exercise_unit[0].id).toBe(1);
  });
});

describe("updateExerciseUnitInSession", () => {
  it("merges the update into the matching unit", () => {
    const session = makeSession({
      exercise_unit: [makeUnit({ id: 10, comment: "" })],
    });
    const result = updateExerciseUnitInSession(session, 10, { comment: "hi" });
    expect(result.exercise_unit[0].comment).toBe("hi");
  });
});

describe("removeExerciseUnitFromSession", () => {
  it("removes the unit with the given id", () => {
    const session = makeSession({
      exercise_unit: [makeUnit({ id: 10 }), makeUnit({ id: 11 })],
    });
    const result = removeExerciseUnitFromSession(session, 10);
    expect(result.exercise_unit.map((u) => u.id)).toEqual([11]);
  });
});

describe("addCommentToSession", () => {
  const makeComment = (
    overrides: Partial<SessionCommentInterface> = {},
  ): SessionCommentInterface => ({
    id: -1,
    session: 100,
    user: 1,
    username: "jarl",
    text: "nice lift",
    datetime: "2026-07-14T12:00:00Z",
    ...overrides,
  });

  it("appends the comment when it belongs to the session", () => {
    const session = makeSession({ id: 100, comments: [] });
    const result = addCommentToSession(session, makeComment({ session: 100 }));
    expect(result.comments.map((c) => c.text)).toEqual(["nice lift"]);
  });

  it("leaves the session untouched when the comment is for another session", () => {
    const session = makeSession({ id: 100, comments: [] });
    const result = addCommentToSession(session, makeComment({ session: 999 }));
    expect(result).toBe(session);
  });
});

describe("updateCommentInSession", () => {
  const comment = (id: number, text: string): SessionCommentInterface => ({
    id,
    session: 100,
    user: 1,
    username: "jarl",
    text,
    datetime: "2026-07-14T12:00:00Z",
  });

  it("replaces the text of the matching comment only", () => {
    const session = makeSession({
      comments: [comment(1, "old"), comment(2, "keep")],
    });
    const result = updateCommentInSession(session, 1, "new");
    expect(result.comments.map((c) => c.text)).toEqual(["new", "keep"]);
  });

  it("does not mutate the original session", () => {
    const session = makeSession({ comments: [comment(1, "old")] });
    updateCommentInSession(session, 1, "new");
    expect(session.comments[0].text).toBe("old");
  });
});

describe("removeCommentFromSession", () => {
  const comment = (id: number): SessionCommentInterface => ({
    id,
    session: 100,
    user: 1,
    username: "jarl",
    text: "x",
    datetime: "2026-07-14T12:00:00Z",
  });

  it("removes the comment with the given id", () => {
    const session = makeSession({ comments: [comment(1), comment(2)] });
    const result = removeCommentFromSession(session, 1);
    expect(result.comments.map((c) => c.id)).toEqual([2]);
  });
});

describe("applySessionUpdate", () => {
  it("shallow-merges the patch into the session", () => {
    const session = makeSession({ description: "old" });
    const result = applySessionUpdate(session, { description: "new" });
    expect(result.description).toBe("new");
    expect(result.id).toBe(100);
  });
});
