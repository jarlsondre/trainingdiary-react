import { createComment } from "../api/comments";
import type { NewCommentData } from "../services/comment.service";
import type { SessionCommentInterface } from "../types/models";
import { useOptimisticSessionMutation } from "./optimistic";
import { addCommentToSession } from "./sessionCache";
import { nextTempId } from "./tempId";

export function useAddComment(username: string) {
  return useOptimisticSessionMutation<NewCommentData, SessionCommentInterface>({
    mutationFn: (data) => createComment(data),
    errorMessage: "Couldn't post the comment — please try again.",
    update: (session, data) =>
      addCommentToSession(session, {
        id: nextTempId(),
        session: data.session,
        user: 0,
        username,
        text: data.text,
        datetime: new Date().toISOString(),
      }),
  });
}
