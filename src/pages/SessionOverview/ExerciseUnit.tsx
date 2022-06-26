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
      <h4 className="exercise-unit-header">
        {props.exerciseUnit.exercise_name}
      </h4>
      <div>
        {props.exerciseUnit.set.map((set, key) => {
          return <Set set={set} key={key} />;
        })}
      </div>
    </div>
  );
}
