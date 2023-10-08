import { useEffect, useState } from "react";
import "./sessionOverview.css";
import Session from "./Session";
import { SessionInterface } from "./Session";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addSession, retrieveSessions } from "../../actions/sessions";
import { CLEAR_SEARCH_USERS } from "../../actions/types";

const compareDates = (
  firstSession: SessionInterface,
  secondSession: SessionInterface
) => {
  return (
    new Date(secondSession.datetime).getTime() -
    new Date(firstSession.datetime).getTime()
  );
};

export default function SessionOverview() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [filterPersonal, setFilterPersonal] = useState<boolean>(false);

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
  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
    if ((reduxSessions as any).length == 0)
      dispatch(retrieveSessions(cursor, filterPersonal));
    dispatch({
      type: CLEAR_SEARCH_USERS,
      payload: {
        searchResults: [], // Initialize searchResults as an empty array
        searchCursor: "", // Initialize searchCursor as an empty string
      },
    });
  }, [dispatch]);

  const handleNewSession = () => {
    const data = {};
    dispatch(addSession(data));
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
          className="checkbox "
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
