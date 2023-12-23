import http from "../http-common";

class ExerciseUnitDataService {
  addExerciseUnit(data: any) {
    return http.post("/exercise-unit/", data);
  }

  deleteExerciseUnit(id: any) {
    return http.delete("/exercise-unit/" + id + "/");
  }

  updateExerciseUnit(id: any, data: any) {
    return http.patch("/exercise-unit/" + id + "/", data);
  }
}

export default new ExerciseUnitDataService();
