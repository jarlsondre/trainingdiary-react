import CommentService, {
  type NewCommentData,
} from "../services/comment.service";

export const createComment = (data: NewCommentData) =>
  CommentService.addComment(data).then((r) => r.data);

export const deleteComment = (id: number): Promise<number> =>
  CommentService.deleteComment(id).then(() => id);

export const updateComment = (id: number, text: string) =>
  CommentService.updateComment(id, text).then((r) => r.data);
