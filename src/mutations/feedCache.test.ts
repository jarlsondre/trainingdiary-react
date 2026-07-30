import type { CursorPage, SessionInterface } from "../types/models";
import {
  type FeedData,
  prependSessionToFeed,
  removeSessionFromFeed,
} from "./feedCache";

const makeSession = (id: number): SessionInterface => ({
  id,
  exercise_unit: [],
  description: "",
  datetime: "2026-07-14T12:00:00Z",
  user: 1,
  username: "jarl",
  liked_by_usernames: [],
  comments: [],
});

const page = (
  results: SessionInterface[],
  next: string | null = null,
): CursorPage<SessionInterface> => ({ next, previous: null, results });

const makeFeed = (pages: CursorPage<SessionInterface>[]): FeedData => ({
  pages,
  pageParams: pages.map(() => ""),
});

describe("prependSessionToFeed", () => {
  it("prepends the session to the first page", () => {
    const feed = makeFeed([page([makeSession(1), makeSession(2)])]);
    const result = prependSessionToFeed(feed, makeSession(99));
    expect(result.pages[0].results.map((s) => s.id)).toEqual([99, 1, 2]);
  });

  it("only touches the first page", () => {
    const feed = makeFeed([
      page([makeSession(1)], "cursor2"),
      page([makeSession(2)]),
    ]);
    const result = prependSessionToFeed(feed, makeSession(99));
    expect(result.pages[1].results.map((s) => s.id)).toEqual([2]);
  });

  it("creates a first page when the feed has none", () => {
    const feed = makeFeed([]);
    const result = prependSessionToFeed(feed, makeSession(99));
    expect(result.pages[0].results.map((s) => s.id)).toEqual([99]);
  });

  it("does not mutate the original feed", () => {
    const feed = makeFeed([page([makeSession(1)])]);
    prependSessionToFeed(feed, makeSession(99));
    expect(feed.pages[0].results.map((s) => s.id)).toEqual([1]);
  });
});

describe("removeSessionFromFeed", () => {
  it("removes the session from whichever page holds it", () => {
    const feed = makeFeed([
      page([makeSession(1), makeSession(2)], "cursor2"),
      page([makeSession(3)]),
    ]);
    const result = removeSessionFromFeed(feed, 2);
    expect(result.pages[0].results.map((s) => s.id)).toEqual([1]);
    expect(result.pages[1].results.map((s) => s.id)).toEqual([3]);
  });

  it("leaves the feed unchanged when the id is absent", () => {
    const feed = makeFeed([page([makeSession(1)])]);
    const result = removeSessionFromFeed(feed, 999);
    expect(result.pages[0].results.map((s) => s.id)).toEqual([1]);
  });
});
