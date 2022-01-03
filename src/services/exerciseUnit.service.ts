import http from "../http-common";

class ExerciseUnitDataService {
  addExerciseUnit(data: any) {
    return http.post("/exercise-unit/", data);
  }

  deleteExerciseUnit(id: any) {
    return http.delete("/exercise-unit/" + id + "/");
  }
}

export default new ExerciseUnitDataService();
