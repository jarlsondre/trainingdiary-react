import { useMutation } from "@tanstack/react-query";
import { createSet, deleteSet, updateSet } from "../api/sets";
import type { NewSetData, UpdateSetData } from "../services/set.service";
import { useInvalidateSessions } from "./invalidate";

export function useAddSet() {
  const invalidate = useInvalidateSessions();
  return useMutation({
    mutationFn: (data: NewSetData) => createSet(data),
    onSuccess: invalidate,
  });
}

export function useUpdateSet() {
  const invalidate = useInvalidateSessions();
  return useMutation({
    mutationFn: (data: UpdateSetData) => updateSet(data),
    onSuccess: invalidate,
  });
}

export function useDeleteSet() {
  const invalidate = useInvalidateSessions();
  return useMutation({
    mutationFn: (id: number) => deleteSet(id),
    onSuccess: invalidate,
  });
}
