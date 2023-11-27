import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ExerciseUnit from "./ExerciseUnit";
import "./session.css";
import { likeSession } from "../../actions/sessions";

export interface SetInterface {
  id: number;
  weight: number;
  repetitions: number;
  set_number: number;
  exercise_unit: number;
}

export interface ExerciseUnitInterface {
  id: number;
  set: SetInterface[];
  exercise_name: string;
  session: number;
  exercise: number;
}

export interface SessionInterface {
  id: number;
  exercise_unit: ExerciseUnitInterface[];
  description: string;
  datetime: string;
  user: number;
  username: string;
  liked_by_usernames: string[];
}

type Props = {
  session: SessionInterface;
};

let months: { [key: number]: string } = {
  0: "January",
  1: "February",
  2: "March",
  3: "April",
  4: "May",
  5: "June",
  6: "July",
  7: "August",
  8: "September",
  9: "October",
  10: "November",
  11: "December",
};

export default function Session(props: Props) {
  let date = new Date(props.session.datetime);
  const personalUser = useSelector((state: any) => state.user.personalUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function getDateString(date: Date) {
    let year = date.getFullYear();
    let monthNum: number = date.getMonth();
    let month = months[monthNum];
    let dayNumber: number = date.getDate();
    let datestring: string =
      month + " " + dayNumber.toString() + ", " + year.toString();
    return datestring;
  }

  function get_likes_string(username: string) {
    if (props.session.liked_by_usernames.length == 0) return "No likes yet";
    let usernames = [];
    if (props.session.liked_by_usernames.includes(personalUser.username)) {
      usernames = props.session.liked_by_usernames.sort((x, y) => {
        return x == personalUser.username
          ? -1
          : y == personalUser.username
          ? 1
          : 0;
      });
    } else usernames = props.session.liked_by_usernames;
    let result = "Liked by " + usernames[0];
    if (usernames.length > 1) {
      result += " and " + (usernames.length - 1) + " more";
    }
    return result;
  }

  const handleLikeSession = () => {
    let id = props.session.id;
    dispatch(likeSession(id));
  };

  const handleOpenSession = () => {
    navigate("/session/" + props.session.id);
  };

  const handleUsernameClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    navigate("/user/" + props.session.username);
  };

  return (
    <div
      className={
        personalUser.username === props.session.username
          ? "session-container-wrap personal-session-container-wrap"
          : "session-container-wrap"
      }
    >
      <div
        className={
          personalUser.username === props.session.username
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
          {props.session.exercise_unit.map((exerciseUnit, key) => {
            return <ExerciseUnit key={key} exerciseUnit={exerciseUnit} />;
          })}
        </div>
      </div>
      {personalUser.username !== props.session.username &&
      !props.session.liked_by_usernames.includes(personalUser.username) ? (
        <div className="like-container">
          <button onClick={handleLikeSession} className="like-button">
            Like
          </button>
          {get_likes_string(personalUser.username)}
        </div>
      ) : (
        <div className="like-container personal-like-container">
          {get_likes_string(personalUser.username)}
        </div>
      )}
    </div>
  );
}
