import type React from "react";
import { useNavigate } from "react-router-dom";
import { useLikeSession } from "../../mutations/sessions";
import { usePersonalUser } from "../../queries/accounts";
import type { SessionInterface } from "../../types/models";
import ExerciseUnit from "./ExerciseUnit";
import "./session.css";

import { compareExerciseUnitIds, months } from "../../utils/utils";

type Props = {
  session: SessionInterface;
};

const MAX_COMMENT_PREVIEW_CHARS = 120;

const truncate = (text: string): string =>
  text.length > MAX_COMMENT_PREVIEW_CHARS
    ? `${text.slice(0, MAX_COMMENT_PREVIEW_CHARS).trimEnd()}…`
    : text;

export default function Session(props: Props) {
  const date = new Date(props.session.datetime);
  const personalUser = usePersonalUser().data;
  const likeMutation = useLikeSession();
  const navigate = useNavigate();

  function getDateString(date: Date): string {
    const year = date.getFullYear();
    const month = months[date.getMonth()];
    const dayNumber = date.getDate();
    return `${month} ${dayNumber.toString()}, ${year.toString()}`;
  }

  function getLikesString(username: string | undefined): string {
    if (props.session.liked_by_usernames.length === 0) return "No likes yet";
    let usernames: string[] = [];
    if (username && props.session.liked_by_usernames.includes(username)) {
      usernames = [...props.session.liked_by_usernames].sort((x, y) => {
        return x === username ? -1 : y === username ? 1 : 0;
      });
    } else usernames = props.session.liked_by_usernames;
    let result = `Liked by ${usernames[0]}`;
    if (usernames.length > 1) {
      result += ` and ${usernames.length - 1} more`;
    }
    return result;
  }

  const handleLikeSession = () => {
    likeMutation.mutate(props.session.id);
  };

  const handleOpenSession = () => {
    // Unsaved optimistic session (negative temp id) isn't openable yet.
    if (props.session.id < 0) return;
    navigate(`/session/${props.session.id}`);
  };

  const handleUsernameClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    navigate(`/user/${props.session.username}`);
  };

  // The two most recent comments (comments come oldest-first from the API).
  const previewComments = props.session.comments.slice(-2);

  return (
    <div
      className={
        personalUser?.username === props.session.username
          ? "session-container-wrap personal-session-container-wrap"
          : "session-container-wrap"
      }
    >
      <div
        className={
          personalUser?.username === props.session.username
            ? "session-container personal-session"
            : "session-container"
        }
        onClick={handleOpenSession}
      >
        <div className="session-header-container">
          <h3 className="session-header">{getDateString(date)}</h3>
        </div>
        <div className="username-container">
          User:{" "}
          <span onClick={handleUsernameClick} className="username-text">
            {props.session.username}
          </span>
        </div>
        {props.session.description && (
          <div className="description-container">
            {props.session.description}
          </div>
        )}
        <div>
          {[...props.session.exercise_unit]
            .sort(compareExerciseUnitIds)
            .map((exerciseUnit) => {
              return (
                <ExerciseUnit
                  key={exerciseUnit.id}
                  exerciseUnit={exerciseUnit}
                />
              );
            })}
        </div>
      </div>
      {personalUser?.username !== props.session.username &&
      !props.session.liked_by_usernames.includes(
        personalUser?.username ?? "",
      ) ? (
        <div className="like-container">
          <button onClick={handleLikeSession} className="like-button">
            Like
          </button>
          {getLikesString(personalUser?.username)}
          {props.session.comments.length > 0 &&
            `, ${props.session.comments.length} comments`}{" "}
        </div>
      ) : (
        <div className="like-container personal-like-container">
          {getLikesString(personalUser?.username)}
          {props.session.comments.length > 0 &&
            `, ${props.session.comments.length} comments`}{" "}
        </div>
      )}
      {previewComments.length > 0 && (
        <div className="comment-preview-container">
          {previewComments.map((comment) => (
            <div key={comment.id} className="comment-preview">
              <span className="comment-preview-username">
                {comment.username}
              </span>{" "}
              {truncate(comment.text)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
