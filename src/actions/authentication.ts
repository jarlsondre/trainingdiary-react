import {
  AUTH_ERROR,
  LOGIN_FAIL,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT,
  RETRIEVE_USER,
} from "./types";
import userService from "../services/user.service";

export const login = (data: any) => async (dispatch: any) => {
  dispatch({
    type: LOGIN_REQUEST,
    payload: null,
  });
  userService
    .login(data)
    .then((res: any) => {
      localStorage.setItem("authToken", JSON.stringify(res.data));
      dispatch({
        type: LOGIN_SUCCESS,
        payload: null,
      });
    })
    .then(() => {
      userService.fetchUser().then((res: any) => {
        dispatch({
          type: RETRIEVE_USER,
          payload: res.data,
        });
      });
    })
    .catch((err) => {
      dispatch({
        type: LOGIN_FAIL,
        payload: null,
      });
    });
};

export const refresh = (token: any) => async (dispatch: any) => {
  try {
    userService
      .refresh(token)
      .then((res: any) => {
        localStorage.setItem("authToken", JSON.stringify(res.data));
        dispatch({
          type: LOGIN_SUCCESS,
          payload: null,
        });
      })
      .then(() => {
        userService.fetchUser().then((res: any) => {
          dispatch({
            type: RETRIEVE_USER,
            payload: res.data,
          });
        });
      })
      .catch((err) => {
        dispatch({
          type: AUTH_ERROR,
          payload: null,
        });
      });
  } catch (err) {}
};

export const logout = () => async (dispatch: any) => {
  dispatch({
    type: LOGOUT,
    payload: null,
  });

  localStorage.setItem("authToken", "");
};
