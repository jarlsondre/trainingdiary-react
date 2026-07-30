import NewSet from "./NewSet";
import SetDetail from "./SetDetail";
import "./exerciseUnitDetail.css";
import { useState } from "react";
import {
  useDeleteExerciseUnit,
  useUpdateExerciseUnit,
} from "../../mutations/exerciseUnits";
import type { ExerciseUnitInterface } from "../../types/models";

type Props = {
  exerciseUnit: ExerciseUnitInterface;
  editable: boolean;
};

export default function ExerciseUnitDetail(props: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [comment, setComment] = useState(props.exerciseUnit.comment);
  const deleteExerciseUnit = useDeleteExerciseUnit();
  const updateExerciseUnit = useUpdateExerciseUnit();

  const toggleIsEditing = () => {
    setIsEditing(!isEditing);
  };
  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
  };
  const handleDeleteExercise = () => {
    setIsEditing(false);
    deleteExerciseUnit.mutate(props.exerciseUnit.id);
  };
  const handleUpdateExercise = () => {
    setIsEditing(false);
    updateExerciseUnit.mutate({ id: props.exerciseUnit.id, data: { comment } });
  };

  return (
    <div className="exercise-unit-detail-container">
      <div className="exercise-info-container">
        <div className="exercise-name-comment-container">
          <div className="exercise-name">
            {props.exerciseUnit.exercise_name}
          </div>
          {isEditing ? (
            <div>
              <input
                type="text"
                maxLength={100}
                defaultValue={props.exerciseUnit.comment}
                onChange={handleCommentChange}
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
          .map((set) => {
            return (
              <SetDetail key={set.id} set={set} editable={props.editable} />
            );
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
                  ...props.exerciseUnit.set.map((set) => set.set_number),
                ) + 1
              : 1
          }
        />
      )}
    </div>
  );
}
