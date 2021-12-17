import React, { useEffect, useState } from "react";
import "./sessionOverview.css";
import Session from "./Session";
import { SessionInterface } from "./Session";

export default function SessionOverview() {
  const [sessions, setSessions] = useState([
    {
      id: 14,
      exercise_unit: [
        {
          id: 5,
          set: [
            {
              id: 5,
              weight: 100,
              repetitions: 8,
              set_number: 1,
              exercise_unit: 5,
            },
          ],
          exercise_name: "squats",
          session: 14,
          exercise: 1,
        },
      ],
      description: "",
      datetime: "2021-12-16T21:56:46.513866Z",
      user: 3,
    },
  ]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/session/", {
      headers: {
        Authorization: "token ab6c19df64ff379ce9583cc18be350f3e7a6839d",
      },
    })
      .then((response: any) => {
        return response.json();
      })
      .then((jsonResponse: any) => {
        setSessions(jsonResponse);
      })
      .catch((err) => {
        console.log("error");
      });
  }, [sessions.length]);
  return (
    <div className="container">
      <div>
        <h2>Sessions</h2>
      </div>
      <div className="session-list">
        {sessions.length > 0 &&
          sessions.map((session: SessionInterface, key) => {
            return (
              <div key={key}>
                <Session session={session} />
              </div>
            );
          })}
      </div>
    </div>
  );
}
