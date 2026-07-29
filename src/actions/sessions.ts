import SessionDataService from "../services/session.service";
import type { AppDispatch } from "../store";
import type { SessionInterface } from "../types/models";
import {
  ADD_SESSION_FAIL,
  ADD_SESSION_REQUEST,
  ADD_SESSION_SUCCESS,
  DELETE_SESSION,
  FETCH_USER_SESSIONS,
  LIKE_SESSION_FAIL,
  LIKE_SESSION_REQUEST,
  LIKE_SESSION_SUCCESS,
  RETRIEVE_SESSIONS,
  RETRIEVE_SINGLE_SESSION_FAIL,
  RETRIEVE_SINGLE_SESSION_REQUEST,
  RETRIEVE_SINGLE_SESSION_SUCCESS,
  UPDATE_PROFILE_USERNAME,
  UPDATE_SESSION_FAIL,
  UPDATE_SESSION_REQUEST,
  UPDATE_SESSION_SUCCESS,
} from "./types";

export const retrieveSessions =
  (cursor: string | null, filterPersonal = false, replaceStore = false) =>
  async (dispatch: AppDispatch) => {
    try {
      const effectiveCursor = replaceStore ? "" : cursor;
      const res = await SessionDataService.getAll(
        effectiveCursor,
        filterPersonal,
      );

      dispatch({
        type: RETRIEVE_SESSIONS,
        payload: res.data,
        replaceStore: replaceStore,
      });
    } catch (err) {
      console.log(err);
    }
  };

export const retrieveSingleSession =
  (id: number) => async (dispatch: AppDispatch) => {
    dispatch({
      type: RETRIEVE_SINGLE_SESSION_REQUEST,
      payload: null,
    });

    try {
      const res = await SessionDataService.getOne(id);
      dispatch({
        type: RETRIEVE_SINGLE_SESSION_SUCCESS,
        payload: res.data,
      });
    } catch (_err) {
      dispatch({
        type: RETRIEVE_SINGLE_SESSION_FAIL,
        payload: null,
      });
    }
  };

export const fetchUserSessions =
  (username: string, cursor: string | null, replaceStore = false) =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await SessionDataService.getUserSessions(
        username,
        cursor,
      );
      dispatch({
        type: FETCH_USER_SESSIONS,
        payload: response.data,
        replaceStore: replaceStore,
        username: username,
      });
    } catch (error) {
      console.error("Failed to fetch user sessions:", error);
    }
  };

export const updateProfileUsername =
  (username: string) => async (dispatch: AppDispatch) => {
    dispatch({ type: UPDATE_PROFILE_USERNAME, payload: username });
  };

export const addSession =
  (data: Partial<SessionInterface>) => async (dispatch: AppDispatch) => {
    dispatch({
      type: ADD_SESSION_REQUEST,
      payload: data,
    });

    try {
      const res = await SessionDataService.addSession(data);
      dispatch({
        type: ADD_SESSION_SUCCESS,
        payload: res.data,
      });
    } catch (_err) {
      dispatch({
        type: ADD_SESSION_FAIL,
        payload: null,
      });
    }
  };

export const deleteSession = (id: number) => async (dispatch: AppDispatch) => {
  try {
    await SessionDataService.deleteSession(id);

    dispatch({
      type: DELETE_SESSION,
      payload: id,
    });
  } catch (err) {
    console.log(err);
  }
};

export const likeSession = (id: number) => async (dispatch: AppDispatch) => {
  dispatch({
    type: LIKE_SESSION_REQUEST,
    payload: id,
  });
  try {
    const res = await SessionDataService.likeSession(id);
    dispatch({
      type: LIKE_SESSION_SUCCESS,
      payload: res.data,
    });
  } catch (_err) {
    dispatch({
      type: LIKE_SESSION_FAIL,
      payload: null,
    });
  }
};

export const updateSession =
  (id: number, data: Partial<SessionInterface>) =>
  async (dispatch: AppDispatch) => {
    dispatch({
      type: UPDATE_SESSION_REQUEST,
      payload: { id: id, data: data },
    });
    try {
      const res = await SessionDataService.updateSession(id, data);
      dispatch({
        type: UPDATE_SESSION_SUCCESS,
        payload: res.data,
      });
    } catch (_err) {
      dispatch({
        type: UPDATE_SESSION_FAIL,
        payload: null,
      });
    }
  };
