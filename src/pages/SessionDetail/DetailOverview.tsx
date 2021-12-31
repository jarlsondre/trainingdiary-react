import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate, Navigate } from "react-router-dom";
import { SessionInterface } from "../SessionOverview/Session";
import ExerciseUnitDetail from "./ExerciseUnitDetail";
import "./detailOverview.css";
import { useDispatch, useSelector } from "react-redux";
import { retrieveSingleSession } from "../../actions/sessions";
import { addExerciseUnit } from "../../actions/exerciseUnits";

interface ExerciseDetail {
  name: string;
  id: number;
}

export default function DetailOverview() {
  let { sessionId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const reduxSingleSession = useSelector<any>(
    (state: any) => state.sessions.selectedSession
  );

  const [session, setSession] = useState<SessionInterface | null>(null);
  const [exercises, setExercises] = useState<ExerciseDetail[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<number>(1);

  useEffect(() => {
    dispatch(retrieveSingleSession(Number(sessionId)));

    // Getting the exercises
    fetch("http://127.0.0.1:8000/exercise-list", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((jsonRes) => {
        setExercises(jsonRes);
      });
  }, [dispatch]);

  const handleAddExercise = () => {
    const data = {
      exercise: selectedExercise,
      session: sessionId,
    };
    dispatch(addExerciseUnit(data));
    window.location.reload();
  };

  const handleDelete = () => {
    let successful = false;
    fetch("http://127.0.0.1:8000/session/" + sessionId + "/", {
      method: "DELETE",
      headers: {
        Authorization: "token ab6c19df64ff379ce9583cc18be350f3e7a6839d",
      },
    })
      .then(() => {
        navigate("/");
      })
      .catch((err) => {
        console.log("Failed to delete session");
      });
  };

  let date = new Date((reduxSingleSession as any).datetime);
  return (
    <div>
      <h1>Session - {date.toLocaleDateString()}</h1>
      <button onClick={handleDelete}>Remove Session</button>
      {(reduxSingleSession as any).exercise_unit &&
        (reduxSingleSession as any).exercise_unit.map(
          (exerciseUnit: any, key: number) => {
            return <ExerciseUnitDetail key={key} exerciseUnit={exerciseUnit} />;
          }
        )}
      <div className="add-exercise-container">
        <select
          name="exercises"
          id="exercises"
          onChange={(event) => {
            setSelectedExercise(parseInt(event.target.value));
          }}
        >
          {exercises.map((exercise, key) => {
            return (
              <option key={key} value={exercise.id}>
                {exercise.name}
              </option>
            );
          })}
        </select>
        <button onClick={handleAddExercise}>Add Exercise</button>
      </div>
    </div>
  );
}
