import React from "react";
import { SetInterface } from "./Session";
import "./set.css";

type Props = {
  set: SetInterface;
};

export default function Set(props: Props) {
  return (
    <div className="set-container">
      {props.set.weight + "kg x " + props.set.repetitions}
    </div>
  );
}
