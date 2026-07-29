import { useAppSelector } from "../../hooks";
import type { SetInterface } from "../../types/models";
import "./set.css";

type Props = {
  set: SetInterface;
};

export default function SetItem(props: Props) {
  const unit = useAppSelector((state) => state.user.personalUser.unit_system);
  const metric = unit === "kg";
  function getWeight(metric: boolean): number {
    const multiplier = metric ? 1 : 2.2;
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
