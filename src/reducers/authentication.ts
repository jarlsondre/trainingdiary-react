import type { AnyAction } from "@reduxjs/toolkit";

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
} from "../actions/types";

export interface AuthenticationState {
  isAuthenticated: boolean;
  isLoading: boolean;
  loginFailed: boolean;
  resetPasswordSuccess: boolean;
  resetPasswordFail: boolean;
  confirmPasswordSuccess: boolean;
  confirmPasswordFail: boolean;
}

const initialState: AuthenticationState = {
  isAuthenticated: false,
  isLoading: false,
  loginFailed: false,
  resetPasswordSuccess: false,
  resetPasswordFail: false,
  confirmPasswordSuccess: false,
  confirmPasswordFail: false,
};

export default function authReducer(
  state: AuthenticationState = initialState,
  action: AnyAction,
): AuthenticationState {
  switch (action.type) {
    case LOGIN_REQUEST:
      return {
        ...state,
        isLoading: true,
        loginFailed: false,
      };

    case LOGIN_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        loginFailed: false,
      };

    case AUTH_ERROR:
    case LOGOUT:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
      };

    case LOGIN_FAIL:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        loginFailed: true,
      };

    case RESET_PASSWORD_REQUEST:
      return {
        ...state,
        isLoading: true,
      };

    case RESET_PASSWORD_SUCCESS:
      return {
        ...state,
        isLoading: false,
        resetPasswordSuccess: true,
        resetPasswordFail: false,
      };

    case RESET_PASSWORD_FAIL:
      return {
        ...state,
        isLoading: false,
        resetPasswordSuccess: false,
        resetPasswordFail: true,
      };

    case CONFIRM_PASSWORD_REQUEST:
      return {
        ...state,
        isLoading: true,
        confirmPasswordSuccess: false,
        confirmPasswordFail: false,
      };

    case CONFIRM_PASSWORD_SUCCESS:
      return {
        ...state,
        isLoading: false,
        confirmPasswordSuccess: true,
        confirmPasswordFail: false,
      };

    case CONFIRM_PASSWORD_FAIL:
      return {
        ...state,
        isLoading: false,
        confirmPasswordSuccess: false,
        confirmPasswordFail: true,
      };

    default:
      return state;
  }
}
