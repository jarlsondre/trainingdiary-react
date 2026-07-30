import { useMutation } from "@tanstack/react-query";
import {
  createExerciseUnit,
  deleteExerciseUnit,
  updateExerciseUnit,
} from "../api/exerciseUnits";
import type { NewExerciseUnit } from "../services/exerciseUnit.service";
import type { ExerciseUnitInterface } from "../types/models";
import { useInvalidateSessions } from "./invalidate";

export function useAddExerciseUnit() {
  const invalidate = useInvalidateSessions();
  return useMutation({
    mutationFn: (data: NewExerciseUnit) => createExerciseUnit(data),
    onSuccess: invalidate,
  });
}

export function useUpdateExerciseUnit() {
  const invalidate = useInvalidateSessions();
  return useMutation({
    mutationFn: (vars: { id: number; data: Partial<ExerciseUnitInterface> }) =>
      updateExerciseUnit(vars.id, vars.data),
    onSuccess: invalidate,
  });
}

export function useDeleteExerciseUnit() {
  const invalidate = useInvalidateSessions();
  return useMutation({
    mutationFn: (id: number) => deleteExerciseUnit(id),
    onSuccess: invalidate,
  });
}
