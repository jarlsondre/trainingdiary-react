import { createComment, deleteComment, updateComment } from "../api/comments";
import type { NewCommentData } from "../services/comment.service";
import type { SessionCommentInterface } from "../types/models";
import { useOptimisticSessionMutation } from "./optimistic";
import {
  addCommentToSession,
  removeCommentFromSession,
  updateCommentInSession,
} from "./sessionCache";
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

export function useUpdateComment() {
  return useOptimisticSessionMutation<
    { id: number; text: string },
    SessionCommentInterface
  >({
    mutationFn: (vars) => updateComment(vars.id, vars.text),
    errorMessage: "Couldn't save the comment — please try again.",
    update: (session, vars) =>
      updateCommentInSession(session, vars.id, vars.text),
  });
}

export function useDeleteComment() {
  return useOptimisticSessionMutation<number, number>({
    mutationFn: (id) => deleteComment(id),
    errorMessage: "Couldn't delete the comment — please try again.",
    update: (session, id) => removeCommentFromSession(session, id),
  });
}
