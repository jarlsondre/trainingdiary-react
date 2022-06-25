import {
  ADD_SESSION_FAIL,
  ADD_SESSION_REQUEST,
  ADD_SESSION_SUCCESS,
  DELETE_SESSION,
  RETRIEVE_SESSIONS,
  RETRIEVE_SINGLE_SESSION_FAIL,
  RETRIEVE_SINGLE_SESSION_REQUEST,
  RETRIEVE_SINGLE_SESSION_SUCCESS,
} from "./types";
import SessionDataService from "../services/session.service";

export const retrieveSessions = () => async (dispatch: any) => {
  try {
    const res = await SessionDataService.getAll();

    dispatch({
      type: RETRIEVE_SESSIONS,
      payload: res.data,
    });
  } catch (err) {
    console.log(err);
  }
};

export const retrieveSingleSession = (id: number) => async (dispatch: any) => {
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
