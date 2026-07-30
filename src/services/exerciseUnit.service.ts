import http from "../http-common";
import type { ExerciseUnitInterface } from "../types/models";

export interface NewExerciseUnit {
  session: number;
  exercise: number;
}

class ExerciseUnitDataService {
  addExerciseUnit(data: NewExerciseUnit) {
    return http.post<ExerciseUnitInterface>("/exercise-unit/", data);
  }

  deleteExerciseUnit(id: number) {
    return http.delete(`/exercise-unit/${id}/`);
  }

  updateExerciseUnit(id: number, data: Partial<ExerciseUnitInterface>) {
    return http.patch<ExerciseUnitInterface>(`/exercise-unit/${id}/`, data);
  }
}

export default new ExerciseUnitDataService();
