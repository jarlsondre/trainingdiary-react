import { createSet, deleteSet, updateSet } from "../api/sets";
import type { NewSetData, UpdateSetData } from "../services/set.service";
import type { SetInterface } from "../types/models";
import { useOptimisticSessionMutation } from "./optimistic";
import {
  addSetToSession,
  removeSetFromSession,
  updateSetInSession,
} from "./sessionCache";
import { nextTempId } from "./tempId";

export function useAddSet() {
  return useOptimisticSessionMutation<NewSetData, SetInterface>({
    mutationFn: (data) => createSet(data),
    errorMessage: "Couldn't add the set — please try again.",
    update: (session, data) => addSetToSession(session, data, nextTempId()),
  });
}

export function useUpdateSet() {
  return useOptimisticSessionMutation<UpdateSetData, SetInterface>({
    mutationFn: (data) => updateSet(data),
    errorMessage: "Couldn't update the set — please try again.",
    update: (session, data) => updateSetInSession(session, data),
  });
}

export function useDeleteSet() {
  return useOptimisticSessionMutation<number, number>({
    mutationFn: (id) => deleteSet(id),
    errorMessage: "Couldn't delete the set — please try again.",
    update: (session, id) => removeSetFromSession(session, id),
  });
}
