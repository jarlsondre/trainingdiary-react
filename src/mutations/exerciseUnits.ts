import { useQueryClient } from "@tanstack/react-query";
import {
  createExerciseUnit,
  deleteExerciseUnit,
  updateExerciseUnit,
} from "../api/exerciseUnits";
import { queryKeys } from "../queries/keys";
import type { NewExerciseUnit } from "../services/exerciseUnit.service";
import type { ExerciseInterface, ExerciseUnitInterface } from "../types/models";
import { useOptimisticSessionMutation } from "./optimistic";
import {
  addExerciseUnitToSession,
  removeExerciseUnitFromSession,
  updateExerciseUnitInSession,
} from "./sessionCache";

export function useAddExerciseUnit() {
  const queryClient = useQueryClient();
  return useOptimisticSessionMutation<NewExerciseUnit, ExerciseUnitInterface>({
    mutationFn: (data) => createExerciseUnit(data),
    errorMessage: "Couldn't add the exercise — please try again.",
    update: (session, data) => {
      const exercises =
        queryClient.getQueryData<ExerciseInterface[]>(queryKeys.exercises()) ??
        [];
      const exerciseName =
        exercises.find((e) => e.id === data.exercise)?.name ?? "";
      return addExerciseUnitToSession(session, {
        exercise: data.exercise,
        sessionId: data.session,
        exerciseName,
      });
    },
  });
}

export function useUpdateExerciseUnit() {
  return useOptimisticSessionMutation<
    { id: number; data: Partial<ExerciseUnitInterface> },
    ExerciseUnitInterface
  >({
    mutationFn: (vars) => updateExerciseUnit(vars.id, vars.data),
    errorMessage: "Couldn't update the exercise — please try again.",
    update: (session, vars) =>
      updateExerciseUnitInSession(session, vars.id, vars.data),
  });
}

export function useDeleteExerciseUnit() {
  return useOptimisticSessionMutation<number, number>({
    mutationFn: (id) => deleteExerciseUnit(id),
    errorMessage: "Couldn't delete the exercise — please try again.",
    update: (session, id) => removeExerciseUnitFromSession(session, id),
  });
}
