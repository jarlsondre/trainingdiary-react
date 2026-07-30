import SessionService from "../services/session.service";
import type { FeedFilter, SessionInterface } from "../types/models";

export const getSessions = (cursor: string | null, feed: FeedFilter) =>
  SessionService.getAll(cursor, feed).then((r) => r.data);

export const getUserSessions = (username: string, cursor: string | null) =>
  SessionService.getUserSessions(username, cursor).then((r) => r.data);

export const getSession = (id: number) =>
  SessionService.getOne(id).then((r) => r.data);

export const createSession = (data: Partial<SessionInterface>) =>
  SessionService.addSession(data).then((r) => r.data);

export const deleteSession = (id: number): Promise<number> =>
  SessionService.deleteSession(id).then(() => id);

export const likeSession = (id: number) =>
  SessionService.likeSession(id).then((r) => r.data);

export const updateSession = (id: number, data: Partial<SessionInterface>) =>
  SessionService.updateSession(id, data).then((r) => r.data);
