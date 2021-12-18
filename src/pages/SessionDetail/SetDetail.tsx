import React, { useState } from "react";
import { SetInterface } from "../SessionOverview/Session";
import "./setDetail.css";

type Props = {
  set: SetInterface;
};

export default function SetDetail(props: Props) {
  const [weight, setWeight] = useState(props.set.weight);
  const [repetitions, setRepetitions] = useState(props.set.repetitions);
  const handleDelete = () => {
    fetch("http://127.0.0.1:8000/set/" + props.set.id + "/", {
      method: "DELETE",
      headers: {
        Authorization: "token ab6c19df64ff379ce9583cc18be350f3e7a6839d",
      },
    })
      .then(() => {
        window.location.reload();
      })
      .catch((err) => {
        console.log("Failed to delete set");
      });
  };

  const handleUpdate = () => {
    const data = {
      weight: weight,
      repetitions: repetitions,
    };
    fetch("http://127.0.0.1:8000/set/" + props.set.id + "/", {
      method: "PATCH",
      headers: {
        Authorization: "token ab6c19df64ff379ce9583cc18be350f3e7a6839d",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        window.location.reload();
      })
      .catch((err) => {
        console.log("Update failed");
      });
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
