import {
  FETCH_USER_FAIL,
  FETCH_USER_REQUEST,
  FETCH_USER_SUCCESS,
  RETRIEVE_USER,
} from "../actions/types";

type ActionType = {
  type: string;
  payload: any;
};

export default function userReducer(user = {}, action: ActionType) {
  const { type, payload } = action;
  switch (type) {
    case RETRIEVE_USER:
      return { ...user, personalUser: payload };

    case FETCH_USER_FAIL:
      return {
        ...user,
        otherUser: {
          fetchUserFail: true,
          fetchUserLoading: false,
          fetchUserSuccess: false,
        },
      };

    case FETCH_USER_REQUEST:
      return {
        ...user,
        otherUser: {
          fetchUserFail: false,
          fetchUserLoading: true,
          fetchUserSuccess: false,
        },
      };

    case FETCH_USER_SUCCESS:
      return {
        ...user,
        otherUser: {
          fetchUserFail: false,
          fetchUserLoading: false,
          fetchUserSuccess: true,
          ...payload,
        },
      };

    default:
      return user;
  }
}
