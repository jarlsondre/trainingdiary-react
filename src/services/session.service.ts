import http from "../http-common";
import type { CursorPage, SessionInterface } from "../types/models";

class SessionDataService {
  getAll(cursor: string | null, filterPersonal = false) {
    return http.get<CursorPage<SessionInterface>>(
      "/session/?cursor=" +
        cursor +
        "&filter_personal=" +
        filterPersonal.toString(),
    );
  }

  getUserSessions(username: string, cursor: string | null) {
    return http.get<CursorPage<SessionInterface>>(
      `/sessions/user/${username}/?cursor=${cursor}`,
    );
  }

  getOne(id: number) {
    return http.get<SessionInterface>(`/session/${id}/`);
  }

  addSession(data: Partial<SessionInterface>) {
    return http.post<SessionInterface>("/session/", data);
  }

  deleteSession(id: number) {
    return http.delete(`/session/${id}/`);
  }

  likeSession(id: number) {
    return http.post<SessionInterface>(`/session/${id}/like-session/`);
  }

  updateSession(id: number, data: Partial<SessionInterface>) {
    return http.patch<SessionInterface>(`/session/${id}/`, data);
  }
}

export default new SessionDataService();
