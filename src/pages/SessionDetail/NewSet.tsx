import React, { useState } from "react";
import "./newSet.css";

type Props = {
  exercise_unit: number;
  set_number: number;
};

export default function NewSet(props: Props) {
  const [weight, setWeight] = useState(0);
  const [repetitions, setRepetitions] = useState(0);

  const handleAddSet = () => {
    const data = {
      exercise_unit: props.exercise_unit,
      set_number: props.set_number,
      weight: weight,
      repetitions: repetitions,
    };
    fetch("http://127.0.0.1:8000/set/", {
      method: "POST",
      headers: {
        Authorization: "token ab6c19df64ff379ce9583cc18be350f3e7a6839d",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        console.log("Successfully added set");
        window.location.reload();
      })
      .catch((err) => {
        console.log("Failed to add set");
      });
  };
  return (
    <div className="new-set-container">
      <input
        type="number"
        id="weight"
        name="weight"
        className="weight-input"
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
        onChange={(event) => {
          setRepetitions(parseInt(event.target.value));
        }}
      ></input>
      <button onClick={handleAddSet}>Add Set</button>
    </div>
  );
}
