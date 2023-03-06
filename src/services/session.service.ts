import http from "../http-common";

class SessionDataService {
  getAll(cursor: any) {
    return http.get("/session/?cursor=" + cursor);
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
