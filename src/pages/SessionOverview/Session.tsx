import React from "react";
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
}

type Props = {
  session: SessionInterface;
};

export default function Session(props: Props) {
  let date = new Date(props.session.datetime);
  return (
    <div className="session-container">
      <h3 className="session-header">{date.toLocaleDateString()}</h3>
      <button>
        <Link to={"session/" + props.session.id}>Open</Link>
      </button>
      <div className="username-container">User: {props.session.username}</div>
      <div>
        {props.session.exercise_unit.map((exerciseUnit, key) => {
          return <ExerciseUnit key={key} exerciseUnit={exerciseUnit} />;
        })}
      </div>
    </div>
  );
}
