import http from "../http-common";

class ExerciseUnitDataService {
  addExerciseUnit(data: any) {
    return http.post("/exercise-unit/", data);
  }
}

export default new ExerciseUnitDataService();
