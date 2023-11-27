import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addSet } from "../../actions/sets";
import "./newSet.css";

type Props = {
  exercise_unit: number;
  set_number: number;
};

export default function NewSet(props: Props) {
  const [weight, setWeight] = useState(0);
  const [repetitions, setRepetitions] = useState(0);

  const unit = useSelector((state: any) => state.user.personalUser.unit_system);
  const metric = unit === "kg";
  const dispatch = useDispatch();

  const handleAddSet = () => {
    const data = {
      exercise_unit: props.exercise_unit,
      set_number: props.set_number,
      weight: Math.round(weight * 10) / 10,
      repetitions: repetitions,
    };
    dispatch(addSet(data));
  };
  return (
    <div className="new-set-container">
      <input
        type="number"
        id="weight"
        name="weight"
        className="weight-input"
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
        onChange={(event) => {
          setRepetitions(parseInt(event.target.value));
        }}
      ></input>
      <button className="add-set-button" onClick={handleAddSet}>
        Save
      </button>
    </div>
  );
}
