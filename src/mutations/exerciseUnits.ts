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
import { nextTempId } from "./tempId";

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
      const optimisticUnit: ExerciseUnitInterface = {
        id: nextTempId(),
        set: [],
        exercise_name: exerciseName,
        session: data.session,
        exercise: data.exercise,
        comment: "",
      };
      return {
        ...session,
        exercise_unit: [...session.exercise_unit, optimisticUnit],
      };
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
    update: (session, vars) => ({
      ...session,
      exercise_unit: session.exercise_unit.map((unit) =>
        unit.id === vars.id ? { ...unit, ...vars.data } : unit,
      ),
    }),
  });
}

export function useDeleteExerciseUnit() {
  return useOptimisticSessionMutation<number, number>({
    mutationFn: (id) => deleteExerciseUnit(id),
    errorMessage: "Couldn't delete the exercise — please try again.",
    update: (session, id) => ({
      ...session,
      exercise_unit: session.exercise_unit.filter((unit) => unit.id !== id),
    }),
  });
}
