import http from "../http-common";

class ExerciseDataService {
  getExercises() {
    return http.get("/exercise-list/");
  }
}

export default new ExerciseDataService();
