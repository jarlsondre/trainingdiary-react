import React from "react";
import { SetInterface } from "../SessionOverview/Session";

type Props = {
  set: SetInterface;
};

export default function SetDetail(props: Props) {
  return (
    <div>
      {props.set.weight + "kg x " + props.set.repetitions}
      <button>Update set</button>
      <button>Delete set</button>
    </div>
  );
}
