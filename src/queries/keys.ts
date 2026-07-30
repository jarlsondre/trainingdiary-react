import type { FeedFilter } from "../types/models";

/**
 * Central query-key factory. Every hook and every invalidation references keys
 * from here so they can never drift apart. Portable (no DOM/router imports).
 */
export const queryKeys = {
  sessions: (feed: FeedFilter) => ["sessions", feed] as const,
  userSessions: (username: string) => ["sessions", "user", username] as const,
  session: (id: number) => ["session", id] as const,
  exercises: () => ["exercises"] as const,
  personalUser: () => ["personalUser"] as const,
  account: (username: string) => ["account", username] as const,
  userSearch: (term: string) => ["users", "search", term] as const,
};
