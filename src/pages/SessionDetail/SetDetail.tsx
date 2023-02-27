import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
  const metric = useSelector((state: any) => state.settings.metric);

  const handleDelete = () => {
    dispatch(deleteSet(props.set));
  };

  const handleUpdate = () => {
    const data = {
      id: props.set.id,
      weight: Math.round(weight * 10) / 10,
      repetitions: repetitions,
    };

    dispatch(updateSet(data));
  };

  return (
    <div className="set-detail-container">
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
          setRepetitions(parseInt(event.target.value));
        }}
      ></input>
      <button onClick={handleUpdate}>Update set</button>
      <button onClick={handleDelete}>Delete set</button>
    </div>
  );
}
