import NewSet from "./NewSet";
import SetDetail from "./SetDetail";
import "./exerciseUnitDetail.css";
import { connect, useSelector } from "react-redux";
import { deleteExerciseUnit } from "../../actions/exerciseUnits";
import { useState } from "react";

function ExerciseUnitDetail(props: any) {
  const [isEditing, setIsEditing] = useState(false);

  const toggleIsEditing = () => {
    setIsEditing(!isEditing);
  };
  const handleDeleteExercise = () => {
    setIsEditing(false);
    props.onDeleteExerciseUnit(Number(props.exerciseUnit.id));
  };
  const handleUpdateExercise = () => {
    setIsEditing(false);
    console.log("update exercise");
  };

  return (
    <div key={props.exerciseUnit} className="exercise-unit-detail-container">
      <div className="exercise-info-container">
        <div className="exercise-name-comment-container">
          <div className="exercise-name">
            {props.exerciseUnit.exercise_name}
          </div>
          {isEditing ? (
            <div>
              <input
                type="text"
                defaultValue={props.exerciseUnit.comment}
              ></input>
            </div>
          ) : (
            <span>
              {props.exerciseUnit.comment && (
                <span className="exercise-unit-comment">
                  ({props.exerciseUnit.comment})
                </span>
              )}
            </span>
          )}
        </div>
        {props.editable &&
          (isEditing ? (
            <div className="exercise-button-container">
              <button
                className="update-exercise-button"
                onClick={handleUpdateExercise}
              >
                Update
              </button>
              <button
                className="delete-exercise-button"
                onClick={handleDeleteExercise}
              >
                Delete
              </button>
            </div>
          ) : (
            <button className="edit-exercise-button" onClick={toggleIsEditing}>
              ...
            </button>
          ))}
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
