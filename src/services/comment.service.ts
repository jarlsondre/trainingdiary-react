import http from "../http-common";
import type { SessionCommentInterface } from "../types/models";

export interface NewCommentData {
  session: number;
  text: string;
}

class CommentDataService {
  addComment(data: NewCommentData) {
    return http.post<SessionCommentInterface>("/session-comment/", data);
  }

  deleteComment(id: number) {
    return http.delete(`/session-comment/${id}/`);
  }
}

export default new CommentDataService();
