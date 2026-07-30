import http from "../http-common";
import type { SetInterface } from "../types/models";

export type NewSetData = Omit<SetInterface, "id">;
export type UpdateSetData = Partial<SetInterface> & { id: number };

class SetDataService {
  addSet(data: NewSetData) {
    return http.post<SetInterface>("/set/", data);
  }

  deleteSet(id: number) {
    return http.delete(`/set/${id}/`);
  }

  updateSet(data: UpdateSetData) {
    return http.patch<SetInterface>(`/set/${data.id}/`, data);
  }
}

export default new SetDataService();
