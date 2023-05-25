import http from "../http-common";

class SessionDataService {
  getAll(cursor: any, filterPersonal: boolean = false) {
    return http.get(
      "/session/?cursor=" +
        cursor +
        "&filter_personal=" +
        filterPersonal.toString()
    );
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

  likeSession(id: number) {
    return http.post("/session/" + id + "/like-session/");
  }

  updateSession(id: number, data: any) {
    return http.patch("/session/" + id + "/", data);
  }
}

export default new SessionDataService();
