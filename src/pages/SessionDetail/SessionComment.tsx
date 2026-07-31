import type React from "react";
import { useState } from "react";
import "./sessionComment.css";

import { formatDate } from "../../utils/utils";

interface SessionCommentProps {
  username: string;
  text: string;
  datetime: string;
  /** Whether the current user owns this comment (may edit/delete it). */
  editable: boolean;
  onSave: (text: string) => void;
  onDelete: () => void;
}

const SessionComment: React.FC<SessionCommentProps> = ({
  username,
  text,
  datetime,
  editable,
  onSave,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(text);

  const handleSave = () => {
    const trimmed = draft.trim();
    if (trimmed === "" || trimmed === text) {
      setIsEditing(false);
      return;
    }
    onSave(trimmed);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setDraft(text);
    setIsEditing(false);
  };

  return (
    <div className="session-comment-container">
      <div className="comment-detail-container">
        <span className="comment-username-container">{username}</span>
        <span className="comment-datetime-container">
          {formatDate(datetime)}
        </span>
      </div>
      {isEditing ? (
        <div className="comment-edit-container">
          <textarea
            className="comment-input-field"
            rows={2}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
          />
          <div className="comment-actions">
            <button className="comment-save-button" onClick={handleSave}>
              Save
            </button>
            <button className="comment-cancel-button" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div>{text}</div>
          {editable && (
            <div className="comment-actions">
              <button
                className="comment-edit-button"
                onClick={() => {
                  setDraft(text);
                  setIsEditing(true);
                }}
              >
                Edit
              </button>
              <button className="comment-delete-button" onClick={onDelete}>
                Delete
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SessionComment;
