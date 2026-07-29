import type { ExerciseUnitInterface } from "../../types/models";
import SetItem from "./Set";
import "./exerciseUnit.css";

type Props = {
  exerciseUnit: ExerciseUnitInterface;
};

export default function ExerciseUnit(props: Props) {
  return (
    <div className="exercise-unit-container">
      <div className="exercise-unit-header-container">
        <h4 className="exercise-unit-header">
          {props.exerciseUnit.exercise_name}
        </h4>
        {props.exerciseUnit.comment && (
          <span className="exercise-unit-header-comment">
            ({props.exerciseUnit.comment})
          </span>
        )}
      </div>
      <div>
        {props.exerciseUnit.set.map((set, key) => {
          return (
            <span key={set.id}>
              {key > 0 && ", "}
              <SetItem set={set} />
            </span>
          );
        })}
      </div>
    </div>
  );
}
