import http from "../http-common";

class SetDataService {
  addSet(data: any) {
    return http.post("/set/", data);
  }

  deleteSet(id: any) {
    return http.delete("/set/" + id + "/");
  }

  updateSet(data: any) {
    return http.patch("/set/" + data.id + "/", data);
  }
}

export default new SetDataService();
