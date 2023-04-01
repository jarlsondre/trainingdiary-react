import NewSet from "./NewSet";
import SetDetail from "./SetDetail";
import "./exerciseUnitDetail.css";
import { connect, useSelector } from "react-redux";
import { deleteExerciseUnit } from "../../actions/exerciseUnits";

function ExerciseUnitDetail(props: any) {
  const handleDeleteExercise = () => {
    props.onDeleteExerciseUnit(Number(props.exerciseUnit.id));
  };

  return (
    <div key={props.exerciseUnit} className="exercise-unit-detail-container">
      <div className="exercise-name-container">
        <div className="exercise-name">{props.exerciseUnit.exercise_name}</div>
        {props.editable && (
          <button
            className="delete-exercise-button"
            onClick={handleDeleteExercise}
          >
            Delete
          </button>
        )}
      </div>
      {props.exerciseUnit.set.length > 0 ? (
        props.exerciseUnit.set.map((set: any, key: number) => {
          return <SetDetail key={key} set={set} editable={props.editable} />;
        })
      ) : props.editable ? (
        ""
      ) : (
        <div className="no-sets-yet">No sets yet</div>
      )}
      {props.editable && (
        <NewSet
          exercise_unit={props.exerciseUnit.id}
          set_number={props.exerciseUnit.set.length + 1}
        />
      )}
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
