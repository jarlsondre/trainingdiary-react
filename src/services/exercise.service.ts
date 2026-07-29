import http from "../http-common";
import type { ExerciseInterface } from "../types/models";

class ExerciseDataService {
  getExercises() {
    return http.get<ExerciseInterface[]>("/exercise-list/");
  }
}

export default new ExerciseDataService();
