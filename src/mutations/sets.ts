import { createSet, deleteSet, updateSet } from "../api/sets";
import type { NewSetData, UpdateSetData } from "../services/set.service";
import type { SetInterface } from "../types/models";
import { useOptimisticSessionMutation } from "./optimistic";
import { nextTempId } from "./tempId";

export function useAddSet() {
  return useOptimisticSessionMutation<NewSetData, SetInterface>({
    mutationFn: (data) => createSet(data),
    errorMessage: "Couldn't add the set — please try again.",
    update: (session, data) => ({
      ...session,
      exercise_unit: session.exercise_unit.map((unit) =>
        unit.id === data.exercise_unit
          ? { ...unit, set: [...unit.set, { ...data, id: nextTempId() }] }
          : unit,
      ),
    }),
  });
}

export function useUpdateSet() {
  return useOptimisticSessionMutation<UpdateSetData, SetInterface>({
    mutationFn: (data) => updateSet(data),
    errorMessage: "Couldn't update the set — please try again.",
    update: (session, data) => ({
      ...session,
      exercise_unit: session.exercise_unit.map((unit) => ({
        ...unit,
        set: unit.set.map((s) => (s.id === data.id ? { ...s, ...data } : s)),
      })),
    }),
  });
}

export function useDeleteSet() {
  return useOptimisticSessionMutation<number, number>({
    mutationFn: (id) => deleteSet(id),
    errorMessage: "Couldn't delete the set — please try again.",
    update: (session, id) => ({
      ...session,
      exercise_unit: session.exercise_unit.map((unit) => ({
        ...unit,
        set: unit.set.filter((s) => s.id !== id),
      })),
    }),
  });
}
