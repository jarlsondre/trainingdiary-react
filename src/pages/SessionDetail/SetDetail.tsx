import { useState } from "react";
import { deleteSet, updateSet } from "../../actions/sets";
import { useAppDispatch, useAppSelector } from "../../hooks";
import type { SetInterface } from "../../types/models";
import "./setDetail.css";

type Props = {
  set: SetInterface;
  editable: boolean;
};

export default function SetDetail(props: Props) {
  const [weight, setWeight] = useState(props.set.weight);
  const [repetitions, setRepetitions] = useState(props.set.repetitions);
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useAppDispatch();
  const unit = useAppSelector((state) => state.user.personalUser.unit_system);
  const metric = unit === "kg";

  const toggleIsEditing = () => {
    setIsEditing(!isEditing);
  };

  const handleDelete = () => {
    dispatch(deleteSet(props.set));
    toggleIsEditing();
  };

  const handleUpdate = () => {
    toggleIsEditing();
    dispatch(
      updateSet({
        id: props.set.id,
        weight: Math.round(weight * 10) / 10,
        repetitions: repetitions,
        set_number: props.set.set_number,
      }),
    );
  };
  if (props.editable)
    return (
      <div className="set-detail-container">
        {isEditing ? (
          <>
            <input
              itemID={props.set.id.toString()}
              type="number"
              id="weight"
              name="weight"
              className="weight-input"
              defaultValue={
                Math.round(props.set.weight * (metric ? 1 : 2.2) * 10) / 10
              }
              onChange={(event) => {
                setWeight(parseFloat(event.target.value) / (metric ? 1 : 2.2));
              }}
            ></input>
            {metric ? "kg x" : "lbs x"}
            <input
              type="number"
              id="repetitions"
              name="repetitions"
              className="repetition-input"
              defaultValue={props.set.repetitions}
              onChange={(event) => {
                setRepetitions(parseInt(event.target.value, 10));
              }}
            ></input>

            <button className="update-set-button" onClick={handleUpdate}>
              Save
            </button>
            <button className="delete-set-button" onClick={handleDelete}>
              Delete
            </button>
          </>
        ) : (
          <div className="set-detail-container">
            <div className="weight-and-repetition-container">
              <span className="big-number weight-number">
                {Math.round(props.set.weight * (metric ? 1 : 2.2) * 10) / 10}
              </span>
              <span className="weight-unit">{metric ? "kg" : "lbs"}</span>
              <span className="times">{" x "}</span>
              <span className="big-number">{props.set.repetitions}</span>
            </div>
            <button className="edit-set-button" onClick={toggleIsEditing}>
              …
            </button>
          </div>
        )}
      </div>
    );
  return (
    <div className="set-detail-container">
      {Math.round(props.set.weight * (metric ? 1 : 2.2) * 10) / 10}{" "}
      {metric ? "kg x" : "lbs x"} {props.set.repetitions}
    </div>
  );
}
