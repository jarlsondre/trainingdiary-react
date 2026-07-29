import type { AnyAction } from "@reduxjs/toolkit";

import {
  FETCH_USER_FAIL,
  FETCH_USER_REQUEST,
  FETCH_USER_SUCCESS,
  FOLLOW_USER_FAIL,
  FOLLOW_USER_REQUEST,
  FOLLOW_USER_SUCCESS,
  RETRIEVE_USER,
  UNFOLLOW_USER_FAIL,
  UNFOLLOW_USER_REQUEST,
  UNFOLLOW_USER_SUCCESS,
  UPDATE_USER_FAIL,
  UPDATE_USER_REQUEST,
  UPDATE_USER_SUCCESS,
} from "../actions/types";
import type {
  AccountInterface,
  AccountSummaryInterface,
} from "../types/models";

/** The logged-in user's account, plus flags for profile updates. */
export type PersonalUserState = Partial<AccountInterface> & {
  updateUserFail: boolean;
  updateUserLoading: boolean;
  updateUserSuccess: boolean;
  following: AccountSummaryInterface[];
  followers: AccountSummaryInterface[];
};

/** The account whose profile page is being viewed, plus fetch flags. */
export type OtherUserState = Partial<AccountInterface> & {
  fetchUserLoading: boolean;
  fetchUserFail: boolean;
  fetchUserSuccess: boolean;
};

export interface UserState {
  personalUser: PersonalUserState;
  otherUser: OtherUserState;
}

const initialState: UserState = {
  personalUser: {
    updateUserFail: false,
    updateUserLoading: false,
    updateUserSuccess: false,
    following: [],
    followers: [],
  },
  otherUser: {
    fetchUserLoading: false,
    fetchUserFail: false,
    fetchUserSuccess: false,
  },
};

export default function userReducer(
  user: UserState = initialState,
  action: AnyAction,
): UserState {
  switch (action.type) {
    case RETRIEVE_USER:
      return { ...user, personalUser: action.payload as PersonalUserState };

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
          ...(action.payload as AccountInterface),
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
          ...(action.payload as AccountInterface),
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

    case FOLLOW_USER_FAIL:
    case UNFOLLOW_USER_FAIL:
    case UNFOLLOW_USER_REQUEST:
    case FOLLOW_USER_REQUEST:
      return user;

    case FOLLOW_USER_SUCCESS: {
      const payload = action.payload as AccountSummaryInterface;
      return {
        ...user,
        personalUser: {
          ...user.personalUser,
          following: [...user.personalUser.following, payload],
        },
        otherUser: {
          ...user.otherUser,
          followers: [
            ...(user.otherUser.followers ?? []),
            {
              id: user.personalUser.id as number,
              username: user.personalUser.username as string,
            },
          ],
        },
      };
    }

    case UNFOLLOW_USER_SUCCESS: {
      const payload = action.payload as AccountSummaryInterface;
      return {
        ...user,
        personalUser: {
          ...user.personalUser,
          following: user.personalUser.following.filter(
            (following) => following.id !== payload.id,
          ),
        },
        otherUser: {
          ...user.otherUser,
          followers: (user.otherUser.followers ?? []).filter(
            (follower) => follower.id !== user.personalUser.id,
          ),
        },
      };
    }

    default:
      return user;
  }
}
