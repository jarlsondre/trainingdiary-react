import http from "../http-common";

class SessionDataService {
  getAll() {
    return http.get("/session/");
  }
}

export default new SessionDataService();
