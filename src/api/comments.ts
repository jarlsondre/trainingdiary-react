import CommentService, {
  type NewCommentData,
} from "../services/comment.service";

export const createComment = (data: NewCommentData) =>
  CommentService.addComment(data).then((r) => r.data);
