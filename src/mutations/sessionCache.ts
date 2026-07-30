import type { NewSetData, UpdateSetData } from "../services/set.service";
import type { ExerciseUnitInterface, SessionInterface } from "../types/models";

/**
 * Pure optimistic patches on a cached session's nested tree. Each returns a new
 * session (no mutation); the mutation hooks apply them via setQueriesData, and
 * they're unit-tested in isolation. This is the "cache surgery" that used to be
 * inline — extracted so the fiddly nested logic is testable on its own.
 */

export const addSetToSession = (
  session: SessionInterface,
  set: NewSetData,
  tempId: number,
): SessionInterface => ({
  ...session,
  exercise_unit: session.exercise_unit.map((unit) =>
    unit.id === set.exercise_unit
      ? { ...unit, set: [...unit.set, { ...set, id: tempId }] }
      : unit,
  ),
});

export const updateSetInSession = (
  session: SessionInterface,
  set: UpdateSetData,
): SessionInterface => ({
  ...session,
  exercise_unit: session.exercise_unit.map((unit) => ({
    ...unit,
    set: unit.set.map((s) => (s.id === set.id ? { ...s, ...set } : s)),
  })),
});

export const removeSetFromSession = (
  session: SessionInterface,
  setId: number,
): SessionInterface => ({
  ...session,
  exercise_unit: session.exercise_unit.map((unit) => ({
    ...unit,
    set: unit.set.filter((s) => s.id !== setId),
  })),
});

export const addExerciseUnitToSession = (
  session: SessionInterface,
  params: { exercise: number; sessionId: number; exerciseName: string },
): SessionInterface => {
  // Units render sorted by id ascending (newest at the bottom), so give the
  // optimistic one an id just above the current max — it lands at the bottom,
  // exactly where the real unit will appear after the refetch.
  const optimisticId =
    session.exercise_unit.reduce((max, unit) => Math.max(max, unit.id), 0) + 1;
  const unit: ExerciseUnitInterface = {
    id: optimisticId,
    set: [],
    exercise_name: params.exerciseName,
    session: params.sessionId,
    exercise: params.exercise,
    comment: "",
  };
  return { ...session, exercise_unit: [...session.exercise_unit, unit] };
};

export const updateExerciseUnitInSession = (
  session: SessionInterface,
  id: number,
  data: Partial<ExerciseUnitInterface>,
): SessionInterface => ({
  ...session,
  exercise_unit: session.exercise_unit.map((unit) =>
    unit.id === id ? { ...unit, ...data } : unit,
  ),
});

export const removeExerciseUnitFromSession = (
  session: SessionInterface,
  id: number,
): SessionInterface => ({
  ...session,
  exercise_unit: session.exercise_unit.filter((unit) => unit.id !== id),
});

export const applySessionUpdate = (
  session: SessionInterface,
  data: Partial<SessionInterface>,
): SessionInterface => ({ ...session, ...data });
