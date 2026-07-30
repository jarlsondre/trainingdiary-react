import ExerciseService from "../services/exercise.service";

export const getExercises = () =>
  ExerciseService.getExercises().then((r) => r.data);
