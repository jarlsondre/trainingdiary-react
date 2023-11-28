import {
  FETCH_USER_FAIL,
  FETCH_USER_REQUEST,
  FETCH_USER_SUCCESS,
  RETRIEVE_USER,
  UPDATE_USER_FAIL,
  UPDATE_USER_REQUEST,
  UPDATE_USER_SUCCESS,
} from "../actions/types";

type ActionType = {
  type: string;
  payload: any;
};

export default function userReducer(user: any = {}, action: ActionType) {
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

    case UPDATE_USER_REQUEST:
      return {
        ...user,
        personalUser: {
          ...user.personalUser,
          updateUserFail: false,
          updateUserLoading: true,
          updateUserSuccess: false,
        },
      };

    case UPDATE_USER_SUCCESS:
      return {
        ...user,
        personalUser: {
          ...user.personalUser,
          updateUserFail: false,
          updateUserLoading: false,
          updateUserSuccess: true,
          ...payload,
        },
      };

    case UPDATE_USER_FAIL:
      return {
        ...user,
        personalUser: {
          ...user.personalUser,
          updateUserFail: true,
          updateUserLoading: false,
          updateUserSuccess: false,
        },
      };

    default:
      return user;
  }
}
