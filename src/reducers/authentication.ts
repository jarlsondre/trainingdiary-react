import {
  LOGIN_FAIL,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  AUTH_ERROR,
  LOGOUT,
  RESET_PASSWORD_REQUEST,
  CONFIRM_PASSWORD_REQUEST,
  CONFIRM_PASSWORD_SUCCESS,
  RESET_PASSWORD_SUCCESS,
  CONFIRM_PASSWORD_FAIL,
  RESET_PASSWORD_FAIL,
} from "../actions/types";

const initialState: any = {
  isAuthenticated: false,
  isLoading: false,
};

type ActionType = {
  type: string;
  payload: any;
};

export default function authReducer(state = initialState, action: ActionType) {
  const { type } = action;
  switch (type) {
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
