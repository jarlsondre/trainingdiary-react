import { useEffect } from "react";
import "./sessionOverview.css";
import Session from "./Session";
import { SessionInterface } from "./Session";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addSession, retrieveSessions } from "../../actions/sessions";

interface sessions {
  sessionList: any[];
  selectedSession: any;
}
const compareDates = (a: SessionInterface, b: SessionInterface) => {
  return new Date(b.datetime).getTime() - new Date(a.datetime).getTime();
};

export default function SessionOverview() {
  const navigate = useNavigate();
  const isAuthenticated = useSelector<any>(
    (state) => state.authentication.isAuthenticated
  );
  const reduxSessions = useSelector<any[]>((state: any) =>
    state.sessions.sessionList.sort(compareDates)
  );

  // Pagination
  const cursor = useSelector<any>((state: any) => state.sessions.cursor);
  const moreToLoad = useSelector<any>(
    (state: any) => state.sessions.moreToLoad
  );
  const dispatch = useDispatch();
  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
    dispatch(retrieveSessions(cursor));
  }, [dispatch]);

  const handleNewSession = () => {
    const data = {};
    dispatch(addSession(data));
  };

  const handleLoadMore = () => {
    dispatch(retrieveSessions(cursor));
  };

  return (
    <div className="container">
      <div>
        <h2>Sessions</h2>
      </div>
      <div className="session-list">
        <button onClick={handleNewSession} className="new-session-button">
          New Session
        </button>
        {(reduxSessions as any[]).length > 0 &&
          (reduxSessions as any[]).map((session: SessionInterface, key) => {
            return (
              <div key={key}>
                <Session session={session} />
              </div>
            );
          })}
        {moreToLoad ? (
          <button
            onClick={handleLoadMore}
            className="load-more-button more-to-load"
          >
            Load More
          </button>
        ) : (
          <button className="load-more-button" disabled>
            No more sessions to load
          </button>
        )}
      </div>
    </div>
  );
}
