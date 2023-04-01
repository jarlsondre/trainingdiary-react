import React, { useState } from "react";
import "./calculator.css";

interface Props {}

function calculateOneRepMax(weight: number, repetitions: number) {
  // Using the Epley formula
  if (weight <= 0) return 0;
  if (repetitions <= 0) return 0;
  return Math.round(weight * (1 + repetitions / 30));
}

export default function Calculator(props: Props) {
  const {} = props;

  const [weight, setWeight] = useState<number>(0);
  const [repetitions, setRepetitions] = useState<number>(0);

  return (
    <div className="calculator-page-container">
      <h1>One Rep Max Calculator</h1>
      <div className="explanatory-text">
        Calculate your estimated 1RM by inserting your numbers here:{" "}
      </div>
      <div>
        Weight:{" "}
        <input
          onChange={(event: any) => {
            setWeight(event.target.value);
          }}
          className="calculator-weight-input"
          type="number"
        ></input>
      </div>
      <div>
        Reptitions:{" "}
        <input
          onChange={(event: any) => {
            setRepetitions(event.target.value);
          }}
          className="calculator-repetition-input"
          type="number"
        ></input>
      </div>{" "}
      <div>Result: {calculateOneRepMax(weight, repetitions)}</div>
    </div>
  );
}
