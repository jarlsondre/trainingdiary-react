import {
  AUTH_ERROR,
  LOGIN_FAIL,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT,
} from "./types";
import userService from "../services/user.service";
import { useNavigate } from "react-router-dom";

export const login = (data: any) => async (dispatch: any) => {
  dispatch({
    type: LOGIN_REQUEST,
    payload: null,
  });
  userService
    .login(data)
    .then((res: any) => {
      console.log("res is", res);
      localStorage.setItem("authToken", JSON.stringify(res.data));
      dispatch({
        type: LOGIN_SUCCESS,
        payload: null,
      });
    })
    .catch((err) => {
      console.log("login failed:", err);
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
      .catch((err) => {
        console.log("refresh action failed", err);
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
