import http from "../http-common";

class SessionDataService {
  getAll() {
    return http.get("/session/");
  }

  getOne(id: number) {
    return http.get("/session/" + id + "/");
  }
}

export default new SessionDataService();
