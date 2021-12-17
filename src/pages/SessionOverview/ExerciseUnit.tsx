import React from "react";
import { ExerciseUnitInterface } from "./Session";
import Set from "./Set";
import "./exerciseUnit.css";

type Props = {
  exerciseUnit: ExerciseUnitInterface;
};

export default function ExerciseUnit(props: Props) {
  return (
    <div className="exercise-unit-container">
      <div>{props.exerciseUnit.exercise_name}</div>
      <div>
        {props.exerciseUnit.set.map((set, key) => {
          return <Set set={set} key={key} />;
        })}
      </div>
    </div>
  );
}
