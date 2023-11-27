import {
  AUTH_ERROR,
  LOGIN_FAIL,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT,
  RETRIEVE_USER,
  RESET_PASSWORD_FAIL,
  RESET_PASSWORD_REQUEST,
  RESET_PASSWORD_SUCCESS,
  CONFIRM_PASSWORD_FAIL,
  CONFIRM_PASSWORD_REQUEST,
  CONFIRM_PASSWORD_SUCCESS,
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
      return userService.fetchPersonalUser();
    })
    .then((res: any) => {
      dispatch({
        type: RETRIEVE_USER,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: LOGIN_FAIL,
        payload: null,
      });
      throw err;
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
        userService.fetchPersonalUser().then((res: any) => {
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

export const resetPassword = (email: string) => async (dispatch: any) => {
  dispatch({
    type: RESET_PASSWORD_REQUEST,
    payload: null,
  });
  userService
    .resetPassword(email)
    .then((res: any) => {
      dispatch({
        type: RESET_PASSWORD_SUCCESS,
        payload: res,
      });
    })
    .catch((err) => {
      dispatch({
        type: RESET_PASSWORD_FAIL,
        payload: null,
      });
    });
};

export const confirmPassword =
  (username: string, token: string, newPassword: string) =>
  async (dispatch: any) => {
    dispatch({
      type: CONFIRM_PASSWORD_REQUEST,
      payload: null,
    });
    userService
      .confirmPassword(username, token, newPassword)
      .then((res: any) => {
        dispatch({
          type: CONFIRM_PASSWORD_SUCCESS,
          payload: res,
        });
      })
      .catch((err) => {
        dispatch({
          type: CONFIRM_PASSWORD_FAIL,
          payload: null,
        });
      });
  };
