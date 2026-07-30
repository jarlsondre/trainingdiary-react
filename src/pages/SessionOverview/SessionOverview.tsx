import { useEffect, useState } from "react";
import "./sessionOverview.css";
import { useNavigate } from "react-router-dom";
import { useAddSession } from "../../mutations/sessions";
import { useSessions } from "../../queries/sessions";
import { useAuthStore } from "../../stores/auth";
import type { SessionInterface } from "../../types/models";
import Session from "./Session";

const compareDates = (
  firstSession: SessionInterface,
  secondSession: SessionInterface,
) =>
  new Date(secondSession.datetime).getTime() -
  new Date(firstSession.datetime).getTime();

export default function SessionOverview() {
  const navigate = useNavigate();
  const [filterPersonal, setFilterPersonal] = useState<boolean>(false);

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // The feed itself now lives entirely in TanStack Query. Changing the filter
  // just switches the query key, which refetches automatically.
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSessions(filterPersonal);
  const addSession = useAddSession();

  const sessions = (data?.pages.flatMap((page) => page.results) ?? []).sort(
    compareDates,
  );

  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
  }, [isAuthenticated, navigate]);

  const handleNewSession = () => {
    addSession.mutate();
  };

  return (
    <div className="container">
      <div className="filter-container">
        <input
          type="checkbox"
          name="filter-personal"
          onChange={(event) => {
            setFilterPersonal(event.target.checked);
          }}
          className="checkbox"
        />
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
        {sessions.map((session) => {
          return (
            <div key={session.id}>
              <Session session={session} />
            </div>
          );
        })}
        {hasNextPage ? (
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="load-more-button more-to-load"
          >
            {isFetchingNextPage ? "Loading..." : "Load More"}
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
