import http from "../http-common";

class SessionDataService {
  getAll() {
    return http.get("/session/");
  }

  getOne(id: number) {
    return http.get("/session/" + id + "/");
  }

  addSession(data: any) {
    return http.post("/session/", data);
  }

  deleteSession(id: number) {
    return http.delete("/session/" + id + "/");
  }
}

export default new SessionDataService();
