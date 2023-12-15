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
        <div>
          <div className="exercise-name">
            {props.exerciseUnit.exercise_name}
          </div>
          {props.exerciseUnit.comment && props.exerciseUnit.comment}
        </div>
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
        [...props.exerciseUnit.set]
          .sort((a, b) => a.set_number - b.set_number)
          .map((set: any, key: number) => {
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
          set_number={
            props.exerciseUnit.set.length > 0
              ? Math.max(
                  ...props.exerciseUnit.set.map((set: any) => set.set_number)
                ) + 1
              : 1
          }
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
