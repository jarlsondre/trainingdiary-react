import http from "../http-common";

class SetDataService {
  getAll() {
    return http.get("/set/");
  }

  getOne(id: number) {
    return http.get("/set/" + id + "/");
  }
}

export default new SetDataService();
