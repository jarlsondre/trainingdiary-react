import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ExerciseUnit from "./ExerciseUnit";
import "./session.css";

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

export default function Session(props: Props) {
  let date = new Date(props.session.datetime);
  const user = useSelector((state: any) => state.user);
  function get_likes_string(username: string) {
    if (props.session.liked_by_usernames.length == 0) return "No likes yet";
    let result = "Liked by " + props.session.liked_by_usernames[0];
    if (props.session.liked_by_usernames.length > 1) {
      result +=
        " and " + (props.session.liked_by_usernames.length - 1) + " more";
    }
    return result;
  }
  return (
    <div
      className={
        user.username === props.session.username
          ? "session-container-wrap personal-session-container-wrap"
          : "session-container-wrap"
      }
    >
      <div
        className={
          user.username === props.session.username
            ? "session-container personal-session"
            : "session-container"
        }
      >
        <div className="session-header-container">
          <h3 className="session-header">{date.toLocaleDateString()}</h3>
          <button>
            <Link to={"session/" + props.session.id}>Open</Link>
          </button>
        </div>
        <div className="username-container">User: {props.session.username}</div>
        <div>
          {props.session.exercise_unit.map((exerciseUnit, key) => {
            return <ExerciseUnit key={key} exerciseUnit={exerciseUnit} />;
          })}
        </div>
        {user.username !== props.session.username ? (
          <div className="like-container">
            <button className="like-button">Like</button>
            {get_likes_string(user.username)}
          </div>
        ) : (
          <div className="like-container personal-like-container">
            {get_likes_string(user.username)}
          </div>
        )}
      </div>
    </div>
  );
}
