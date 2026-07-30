import { useState } from "react";
import { useAddSet } from "../../mutations/sets";
import { usePersonalUser } from "../../queries/accounts";
import "./newSet.css";

type Props = {
  exercise_unit: number;
  set_number: number;
};

export default function NewSet(props: Props) {
  const [weight, setWeight] = useState(0);
  const [repetitions, setRepetitions] = useState(0);

  const unit = usePersonalUser().data?.unit_system;
  const metric = unit === "kg";
  const addSetMutation = useAddSet();

  const handleAddSet = () => {
    addSetMutation.mutate({
      exercise_unit: props.exercise_unit,
      set_number: props.set_number,
      weight: Math.round(weight * 10) / 10,
      repetitions: repetitions,
    });
  };
  return (
    <div className="new-set-container">
      <input
        type="number"
        id="weight"
        name="weight"
        className="weight-input"
        onClick={(event) => {
          (event.target as HTMLInputElement).value = "";
          setWeight(0);
        }}
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
        onClick={(event) => {
          (event.target as HTMLInputElement).value = "";
          setRepetitions(0);
        }}
        onChange={(event) => {
          setRepetitions(parseInt(event.target.value, 10));
        }}
      ></input>
      <button className="add-set-button" onClick={handleAddSet}>
        Save
      </button>
    </div>
  );
}
