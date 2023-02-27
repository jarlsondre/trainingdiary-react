import React from "react";
import { useSelector } from "react-redux";
import { SetInterface } from "./Session";
import "./set.css";

type Props = {
  set: SetInterface;
};

export default function Set(props: Props) {
  const metric = useSelector((state: any) => state.settings.metric);
  function getWeight(metric: boolean) {
    let multiplier = metric ? 1 : 2.2;
    return Math.round(props.set.weight * multiplier * 10) / 10;
  }
  return (
    <div className="set-container">
      {getWeight(metric) +
        (metric ? "kg x " : "lbs x ") +
        props.set.repetitions}
    </div>
  );
}
