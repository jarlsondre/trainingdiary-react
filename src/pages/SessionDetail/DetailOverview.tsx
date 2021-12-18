import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { SessionInterface } from "../SessionOverview/Session";
import ExerciseUnitDetail from "./ExerciseUnitDetail";
import "./detailOverview.css";

interface ExerciseDetail {
  name: string;
  id: number;
}

export default function DetailOverview() {
  let { sessionId } = useParams();

  const [session, setSession] = useState<SessionInterface | null>(null);
  const [exercises, setExercises] = useState<ExerciseDetail[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<number>(1);

  useEffect(() => {
    // Getting the session details
    fetch("http://127.0.0.1:8000/session/" + sessionId + "/", {
      method: "GET",
      headers: {
        Authorization: "token ab6c19df64ff379ce9583cc18be350f3e7a6839d",
      },
    })
      .then((res) => res.json())
      .then((jsonRes) => {
        setSession(jsonRes);
      })
      .catch((err) => {
        console.log("Error when fetching session ");
      });

    // Getting the exercises
    fetch("http://127.0.0.1:8000/exercise-list", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((jsonRes) => {
        setExercises(jsonRes);
      });
  }, []);

  const handleAddExercise = () => {
    const data = {
      exercise: selectedExercise,
      session: sessionId,
    };
    fetch("http://127.0.0.1:8000/exercise-unit/", {
      method: "POST",
      headers: {
        Authorization: "token ab6c19df64ff379ce9583cc18be350f3e7a6839d",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then(() => {
        window.location.reload();
      })
      .catch((err) => {
        console.log("Fetch failed");
      });
    return false;
  };

  if (!session)
    return (
      <div>
        <Link to={"/"}>Home</Link>
        No session :(())
      </div>
    );
  else {
    let date = new Date(session.datetime);
    return (
      <div>
        <Link to={"/"}>Home</Link>
        <h1>Session - {date.toLocaleDateString()}</h1>
        {session.exercise_unit.map((exerciseUnit, key) => {
          return <ExerciseUnitDetail key={key} exerciseUnit={exerciseUnit} />;
        })}
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
}
