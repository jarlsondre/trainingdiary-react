import { useEffect, useState } from "react";
import "./sessionOverview.css";
import { useNavigate } from "react-router-dom";
import { addSession, retrieveSessions } from "../../actions/sessions";
import { CLEAR_SEARCH_USERS } from "../../actions/types";
import { useAppDispatch, useAppSelector } from "../../hooks";
import type { SessionInterface } from "../../types/models";
import Session from "./Session";

const compareDates = (
  firstSession: SessionInterface,
  secondSession: SessionInterface,
) => {
  return (
    new Date(secondSession.datetime).getTime() -
    new Date(firstSession.datetime).getTime()
  );
};

export default function SessionOverview() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [filterPersonal, setFilterPersonal] = useState<boolean>(false);

  const isAuthenticated = useAppSelector(
    (state) => state.authentication.isAuthenticated,
  );
  const reduxSessions = useAppSelector((state) =>
    [...state.sessions.sessionList].sort(compareDates),
  );

  // Pagination
  const cursor = useAppSelector((state) => state.sessions.cursor);
  const moreToLoad = useAppSelector((state) => state.sessions.moreToLoad);
  // biome-ignore lint/correctness/useExhaustiveDependencies: mount-only fetch; dependency cleanup belongs to a behavior pass
  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
    // Always fetch a fresh first page on landing so the list reflects current
    // server state (e.g. after a session is deleted). Trusting the cached list
    // here left it stale/empty until a manual refresh.
    dispatch(retrieveSessions("", filterPersonal, true));
    dispatch({
      type: CLEAR_SEARCH_USERS,
      payload: {
        searchResults: [],
        searchCursor: "",
      },
    });
  }, [dispatch]);

  const handleNewSession = () => {
    dispatch(addSession({}));
  };

  const handleLoadMore = () => {
    dispatch(retrieveSessions(cursor, filterPersonal));
  };

  const handleSetFilterPersonal = (newFilterPersonalValue: boolean) => {
    if (newFilterPersonalValue === filterPersonal) return;

    // Since we are changing filter type, we now have to
    // replace the store
    const replaceStore = true;
    setFilterPersonal(newFilterPersonalValue);
    dispatch(retrieveSessions(cursor, newFilterPersonalValue, replaceStore));
  };

  return (
    <div className="container">
      <div className="filter-container">
        <input
          type="checkbox"
          name="filter-personal"
          onChange={(event) => {
            handleSetFilterPersonal(event.target.checked);
          }}
          className="checkbox"
        ></input>
        <label htmlFor="filter-personal" className="checkbox-label">
          Personal Sessions
        </label>
      </div>
      <div>
        <h2>Sessions</h2>
      </div>
      <div className="session-list">
        <button onClick={handleNewSession} className="new-session-button">
          New Session
        </button>
        {reduxSessions.length > 0 &&
          reduxSessions.map((session) => {
            return (
              <div key={session.id}>
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
