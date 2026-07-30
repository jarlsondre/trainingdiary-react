import { useQueryClient } from "@tanstack/react-query";

/**
 * Returns a function that refreshes every session list AND every session
 * detail. Used by mutations that change a session's contents (sets, exercise
 * units, session edits) so the open detail view and the feed both stay correct.
 * The bare "sessions"/"session" prefixes match all such queries.
 */
export function useInvalidateSessions() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ["sessions"] });
    queryClient.invalidateQueries({ queryKey: ["session"] });
  };
}
