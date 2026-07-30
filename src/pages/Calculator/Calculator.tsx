import { useState } from "react";
import "./calculator.css";

function calculateOneRepMax(weight: number, repetitions: number): number {
  // Using the Epley formula
  if (weight <= 0) return 0;
  if (repetitions <= 0) return 0;
  return Math.round(weight * (1 + repetitions / 30));
}

export default function Calculator() {
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
          onChange={(event) => {
            setWeight(parseFloat(event.target.value) || 0);
          }}
          className="calculator-weight-input"
          type="number"
        />
      </div>
      <div>
        Repetitions:{" "}
        <input
          onChange={(event) => {
            setRepetitions(parseInt(event.target.value, 10) || 0);
          }}
          className="calculator-repetition-input"
          type="number"
        />
      </div>{" "}
      <div>Result: {calculateOneRepMax(weight, repetitions)}</div>
    </div>
  );
}
