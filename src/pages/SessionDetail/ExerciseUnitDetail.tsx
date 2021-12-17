import React from "react";
import { ExerciseUnitInterface } from "../SessionOverview/Session";
import SetDetail from "./SetDetail";

type Props = {
  exerciseUnit: ExerciseUnitInterface;
};

export default function ExerciseUnitDetail(props: Props) {
  const handleRemoveExercise = () => {
    fetch(
      "http://127.0.0.1:8000/exercise-unit/" + props.exerciseUnit.id + "/",
      {
        method: "DELETE",
        headers: {
          Authorization: "token ab6c19df64ff379ce9583cc18be350f3e7a6839d",
        },
      }
    )
      .then((res) => {
        console.log("Successfully deleted exercise!");
        window.location.reload();
      })
      .catch((err) => {
        console.log("Failed to delete", err.message);
      });
  };

  return (
    <div>
      <h2>{props.exerciseUnit.exercise_name}</h2>
      <button onClick={handleRemoveExercise}>Remove Exercise</button>
      {props.exerciseUnit.set.map((set, key) => {
        return <SetDetail key={key} set={set} />;
      })}
      <button>Add Set</button>
    </div>
  );
}
