import { useEffect, useState } from "react";
import "./sessionOverview.css";
import { useNavigate } from "react-router-dom";
import { useAddSession } from "../../mutations/sessions";
import { useSessions } from "../../queries/sessions";
import { useAuthStore } from "../../stores/auth";
import type { FeedFilter, SessionInterface } from "../../types/models";
import Session from "./Session";

const compareDates = (
  firstSession: SessionInterface,
  secondSession: SessionInterface,
) =>
  new Date(secondSession.datetime).getTime() -
  new Date(firstSession.datetime).getTime();

const FEED_OPTIONS: { value: FeedFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "personal", label: "You" },
  { value: "following", label: "Following" },
];

const FEED_STORAGE_KEY = "feedFilter";

const isFeedFilter = (value: string | null): value is FeedFilter =>
  value === "all" || value === "personal" || value === "following";

export default function SessionOverview() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Remembered across reloads; defaults to "all".
  const [feed, setFeed] = useState<FeedFilter>(() => {
    const stored = localStorage.getItem(FEED_STORAGE_KEY);
    return isFeedFilter(stored) ? stored : "all";
  });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending } =
    useSessions(feed);
  const addSession = useAddSession();

  const sessions = (data?.pages.flatMap((page) => page.results) ?? []).sort(
    compareDates,
  );

  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
  }, [isAuthenticated, navigate]);

  const handleFeedChange = (value: FeedFilter) => {
    setFeed(value);
    localStorage.setItem(FEED_STORAGE_KEY, value);
  };

  const handleNewSession = () => {
    addSession.mutate();
  };

  return (
    <div className="container">
      <div className="feed-filter">
        {FEED_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            className={
              feed === option.value
                ? "feed-filter-button feed-filter-active"
                : "feed-filter-button"
            }
            onClick={() => handleFeedChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
      <div>
        <h2>Sessions</h2>
      </div>
      <div className="session-list">
        <button onClick={handleNewSession} className="new-session-button">
          New Session
        </button>
        {sessions.length > 0 ? (
          <>
            {sessions.map((session) => (
              <div key={session.id}>
                <Session session={session} />
              </div>
            ))}
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
          </>
        ) : (
          !isPending && <div className="empty-feed">No sessions yet</div>
        )}
      </div>
    </div>
  );
}
