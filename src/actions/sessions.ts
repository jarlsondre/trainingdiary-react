import {
  ADD_SESSION_FAIL,
  ADD_SESSION_REQUEST,
  ADD_SESSION_SUCCESS,
  DELETE_SESSION,
  LIKE_SESSION_FAIL,
  LIKE_SESSION_REQUEST,
  LIKE_SESSION_SUCCESS,
  RETRIEVE_SESSIONS,
  RETRIEVE_SINGLE_SESSION_FAIL,
  RETRIEVE_SINGLE_SESSION_REQUEST,
  RETRIEVE_SINGLE_SESSION_SUCCESS,
  UPDATE_SESSION_FAIL,
  UPDATE_SESSION_REQUEST,
  UPDATE_SESSION_SUCCESS,
} from "./types";
import SessionDataService from "../services/session.service";

export const retrieveSessions =
  (
    cursor: any,
    filterPersonal: boolean = false,
    replaceStore: boolean = false
  ) =>
  async (dispatch: any) => {
    try {
      if (replaceStore) cursor = "";
      const res = await SessionDataService.getAll(
        (cursor = cursor),
        (filterPersonal = filterPersonal)
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
  (id: number, sessionList: any) => async (dispatch: any) => {
    dispatch({
      type: RETRIEVE_SINGLE_SESSION_REQUEST,
      payload: null,
    });

    await SessionDataService.getOne(id)
      .then((res: any) => {
        dispatch({
          type: RETRIEVE_SINGLE_SESSION_SUCCESS,
          payload: res.data,
        });
      })
      .catch((err) => {
        dispatch({
          type: RETRIEVE_SINGLE_SESSION_FAIL,
          payload: null,
        });
      });
  };

export const addSession = (data: any) => async (dispatch: any) => {
  dispatch({
    type: ADD_SESSION_REQUEST,
    payload: data,
  });

  await SessionDataService.addSession(data)
    .then((res: any) => {
      dispatch({
        type: ADD_SESSION_SUCCESS,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: ADD_SESSION_FAIL,
        payload: null,
      });
    });
};

export const deleteSession = (id: number) => async (dispatch: any) => {
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

export const likeSession = (id: number) => async (dispatch: any) => {
  dispatch({
    type: LIKE_SESSION_REQUEST,
    payload: id,
  });
  await SessionDataService.likeSession(id)
    .then((res: any) => {
      dispatch({
        type: LIKE_SESSION_SUCCESS,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: LIKE_SESSION_FAIL,
        payload: null,
      });
    });
};

export const updateSesssion =
  (id: number, data: any) => async (dispatch: any) => {
    dispatch({
      type: UPDATE_SESSION_REQUEST,
      payload: { id: id, data: data },
    });
    await SessionDataService.updateSession(id, data)
      .then((res: any) => {
        dispatch({
          type: UPDATE_SESSION_SUCCESS,
          payload: res.data,
        });
      })
      .catch((err) => {
        dispatch({
          type: UPDATE_SESSION_FAIL,
          payload: null,
        });
      });
  };
