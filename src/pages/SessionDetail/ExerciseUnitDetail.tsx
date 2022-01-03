import React from "react";
import { ExerciseUnitInterface } from "../SessionOverview/Session";
import NewSet from "./NewSet";
import SetDetail from "./SetDetail";
import "./exerciseUnitDetail.css";
import { useDispatch, useSelector, connect } from "react-redux";
import { deleteExerciseUnit } from "../../actions/exerciseUnits";

function ExerciseUnitDetail(props: any) {
  const handleRemoveExercise = () => {
    props.onDeleteExerciseUnit(Number(props.exerciseUnit.id));
  };

  return (
    <div key={props.exerciseUnit}>
      <div className="exercise-name-container">
        <h2 className="exercise-name">{props.exerciseUnit.exercise_name}</h2>
        <button
          className="remove-exercise-button"
          onClick={handleRemoveExercise}
        >
          Remove Exercise
        </button>
      </div>
      {props.exerciseUnit.set.map((set: any, key: number) => {
        return <SetDetail key={key} set={set} />;
      })}
      <NewSet
        exercise_unit={props.exerciseUnit.id}
        set_number={props.exerciseUnit.set.length + 1}
      />
    </div>
  );
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    onDeleteExerciseUnit: (id: number) => {
      dispatch(deleteExerciseUnit(id));
    },
  };
};

export default connect(null, mapDispatchToProps)(ExerciseUnitDetail);
