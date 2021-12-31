import React, { useEffect, useState } from "react";
import "./sessionOverview.css";
import Session from "./Session";
import { SessionInterface } from "./Session";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { retrieveSessions } from "../../actions/sessions";

interface sessions {
  sessionList: any[];
  selectedSession: any;
}

export default function SessionOverview() {
  const navigate = useNavigate();
  let token: string | null;
  if (localStorage.getItem("token") !== "") {
    token = localStorage.getItem("token");
  } else if (sessionStorage.getItem("token") !== "") {
    token = sessionStorage.getItem("token");
  } else {
    navigate("/login");
  }

  const dispatch = useDispatch();
  const reduxSessions = useSelector<any[]>((state: any) => state.sessions);
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
    dispatch(retrieveSessions());
    // fetch("http://127.0.0.1:8000/session/", {
    //   headers: {
    //     Authorization: "token ab6c19df64ff379ce9583cc18be350f3e7a6839d",
    //   },
    // })
    //   .then((response: any) => {
    //     return response.json();
    //   })
    //   .then((jsonResponse: any) => {
    //     setSessions(jsonResponse);
    //   })
    //   .catch((err) => {
    //     console.log("error");
    //   });
  }, [dispatch]);

  const handleNewSession = () => {
    const data = {
      datetime: new Date().toLocaleString(),
    };
    fetch("http://127.0.0.1:8000/session/", {
      method: "POST",
      headers: {
        Authorization: "token ab6c19df64ff379ce9583cc18be350f3e7a6839d",
      },
    })
      .then(() => {
        console.log("Successfully created new session");
        window.location.reload();
      })
      .catch((err) => {
        console.log("Failed to create new session");
      });
  };

  return (
    <div className="container">
      <div>
        <h2>Sessions</h2>
      </div>
      <div className="session-list">
        {(reduxSessions as sessions).sessionList.length > 0 &&
          (reduxSessions as sessions).sessionList.map(
            (session: SessionInterface, key) => {
              return (
                <div key={key}>
                  <Session session={session} />
                </div>
              );
            }
          )}
        <button onClick={handleNewSession}>New Session</button>
      </div>
    </div>
  );
}
