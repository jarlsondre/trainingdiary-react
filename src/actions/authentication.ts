import type { LoginData } from "../services/user.service";
import userService from "../services/user.service";
import type { AppDispatch } from "../store";
import {
  AUTH_ERROR,
  CONFIRM_PASSWORD_FAIL,
  CONFIRM_PASSWORD_REQUEST,
  CONFIRM_PASSWORD_SUCCESS,
  LOGIN_FAIL,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT,
  RESET_PASSWORD_FAIL,
  RESET_PASSWORD_REQUEST,
  RESET_PASSWORD_SUCCESS,
  RETRIEVE_USER,
} from "./types";

export const login = (data: LoginData) => async (dispatch: AppDispatch) => {
  dispatch({
    type: LOGIN_REQUEST,
    payload: null,
  });

  try {
    const loginResult = await userService.login(data);
    localStorage.setItem("authToken", JSON.stringify(loginResult.data));
    dispatch({
      type: LOGIN_SUCCESS,
      payload: null,
    });
    const userResult = await userService.fetchPersonalUser();
    dispatch({
      type: RETRIEVE_USER,
      payload: userResult.data,
    });
  } catch (_err) {
    dispatch({
      type: LOGIN_FAIL,
      payload: null,
    });
  }
};

export const refresh = (token: string) => async (dispatch: AppDispatch) => {
  try {
    const refreshResult = await userService.refresh(token);
    localStorage.setItem("authToken", JSON.stringify(refreshResult.data));
    dispatch({
      type: LOGIN_SUCCESS,
      payload: null,
    });
    const userResult = await userService.fetchPersonalUser();
    dispatch({
      type: RETRIEVE_USER,
      payload: userResult.data,
    });
  } catch (_err) {
    dispatch({
      type: AUTH_ERROR,
      payload: null,
    });
  }
};

export const logout = () => async (dispatch: AppDispatch) => {
  dispatch({
    type: LOGOUT,
    payload: null,
  });

  localStorage.setItem("authToken", "");
};

export const resetPassword =
  (email: string) => async (dispatch: AppDispatch) => {
    dispatch({
      type: RESET_PASSWORD_REQUEST,
      payload: null,
    });
    try {
      const res = await userService.resetPassword(email);
      dispatch({
        type: RESET_PASSWORD_SUCCESS,
        payload: res,
      });
    } catch (_err) {
      dispatch({
        type: RESET_PASSWORD_FAIL,
        payload: null,
      });
    }
  };

export const confirmPassword =
  (username: string, token: string, newPassword: string) =>
  async (dispatch: AppDispatch) => {
    dispatch({
      type: CONFIRM_PASSWORD_REQUEST,
      payload: null,
    });
    try {
      const res = await userService.confirmPassword(
        username,
        token,
        newPassword,
      );
      dispatch({
        type: CONFIRM_PASSWORD_SUCCESS,
        payload: res,
      });
    } catch (_err) {
      dispatch({
        type: CONFIRM_PASSWORD_FAIL,
        payload: null,
      });
    }
  };
