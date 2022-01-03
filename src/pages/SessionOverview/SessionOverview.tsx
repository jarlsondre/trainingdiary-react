import React, { useEffect, useState } from "react";
import "./sessionOverview.css";
import Session from "./Session";
import { SessionInterface } from "./Session";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addSession, retrieveSessions } from "../../actions/sessions";
import { refresh } from "../../actions/authentication";

interface sessions {
  sessionList: any[];
  selectedSession: any;
}

export default function SessionOverview() {
  const navigate = useNavigate();
  const isAuthenticated = useSelector<any>(
    (state) => state.authentication.isAuthenticated
  );

  const dispatch = useDispatch();
  const reduxSessions = useSelector<any[]>((state: any) => state.sessions);
  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
    dispatch(retrieveSessions());
  }, [dispatch]);

  const handleNewSession = () => {
    const data = {};
    dispatch(addSession(data));
    // fetch("http://127.0.0.1:8000/session/", {
    //   method: "POST",
    //   headers: {
    //     Authorization: "token ab6c19df64ff379ce9583cc18be350f3e7a6839d",
    //   },
    // })
    //   .then(() => {
    //     console.log("Successfully created new session");
    //     window.location.reload();
    //   })
    //   .catch((err) => {
    //     console.log("Failed to create new session");
    //   });
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
