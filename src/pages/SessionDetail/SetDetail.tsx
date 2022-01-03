import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { deleteSet, updateSet } from "../../actions/sets";
import { SetInterface } from "../SessionOverview/Session";
import "./setDetail.css";

type Props = {
  set: SetInterface;
};

export default function SetDetail(props: Props) {
  const [weight, setWeight] = useState(props.set.weight);
  const [repetitions, setRepetitions] = useState(props.set.repetitions);
  const dispatch = useDispatch();

  const handleDelete = () => {
    dispatch(deleteSet(props.set));
  };

  const handleUpdate = () => {
    const data = {
      id: props.set.id,
      weight: weight,
      repetitions: repetitions,
    };

    dispatch(updateSet(data));
  };

  return (
    <div className="set-detail-container">
      <input
        type="number"
        id="weight"
        name="weight"
        className="weight-input"
        defaultValue={props.set.weight}
        onChange={(event) => {
          setWeight(parseInt(event.target.value));
        }}
      ></input>
      {"kg x"}
      <input
        type="number"
        id="repetitions"
        name="repetitions"
        className="repetition-input"
        defaultValue={props.set.repetitions}
        onChange={(event) => {
          setRepetitions(parseInt(event.target.value));
        }}
      ></input>
      <button onClick={handleUpdate}>Update set</button>
      <button onClick={handleDelete}>Delete set</button>
    </div>
  );
}
