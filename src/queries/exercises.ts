import { useQuery } from "@tanstack/react-query";
import { getExercises } from "../api/exercises";
import { queryKeys } from "./keys";

/** The exercise reference list (rarely changes). */
export function useExercises() {
  return useQuery({
    queryKey: queryKeys.exercises(),
    queryFn: getExercises,
    staleTime: 1000 * 60 * 60,
  });
}
