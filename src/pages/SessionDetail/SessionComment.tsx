import React from "react";
import "./sessionComment.css";

import { formatDate } from "../../utils/utils";

interface SessionCommentProps {
  username: string;
  text: string;
  datetime: Date;
}

const SessionComment: React.FC<SessionCommentProps> = ({
  username,
  text,
  datetime,
}) => {
  return (
    <div className="session-comment-container">
      <div className="comment-detail-container">
        <span className="comment-username-container">{username}</span>
        <span className="comment-datetime-container">
          {formatDate(datetime.toString())}
        </span>
      </div>
      <div>{text}</div>
    </div>
  );
};

export default SessionComment;
