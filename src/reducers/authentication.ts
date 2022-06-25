import {
  LOGIN_FAIL,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  AUTH_ERROR,
  LOGOUT,
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
      };

    case LOGIN_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
      };
    case AUTH_ERROR:
    case LOGIN_FAIL:
    case LOGOUT:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
      };

    default:
      return state;
  }
}
