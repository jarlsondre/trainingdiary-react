import {
  FETCH_USER_FAIL,
  FETCH_USER_REQUEST,
  FETCH_USER_SUCCESS,
  FOLLOW_USER_FAIL,
  FOLLOW_USER_REQUEST,
  FOLLOW_USER_SUCCESS,
  UNFOLLOW_USER_FAIL,
  UNFOLLOW_USER_REQUEST,
  UNFOLLOW_USER_SUCCESS,
  UPDATE_USER_FAIL,
  UPDATE_USER_REQUEST,
  UPDATE_USER_SUCCESS,
} from "./types";
import userService from "../services/user.service";

export const fetchUser = (username: string) => async (dispatch: any) => {
  dispatch({
    type: FETCH_USER_REQUEST,
    payload: null,
  });
  try {
    const result: any = await userService.fetchUser(username);
    dispatch({
      type: FETCH_USER_SUCCESS,
      payload: result.data,
    });
  } catch (error) {
    dispatch({
      type: FETCH_USER_FAIL,
      payload: null,
    });
    console.log(error);
  }
};

export const updateUser = (id: string, data: any) => async (dispatch: any) => {
  dispatch({
    type: UPDATE_USER_REQUEST,
    payload: null,
  });
  try {
    const result: any = await userService.updateUser(id, data);
    dispatch({
      type: UPDATE_USER_SUCCESS,
      payload: result.data,
    });
  } catch (error) {
    dispatch({
      type: UPDATE_USER_FAIL,
      payload: null,
    });
    console.log(error);
  }
};

export const followUser =
  (id: string, username: string) => async (dispatch: any) => {
    dispatch({
      type: FOLLOW_USER_REQUEST,
      payload: null,
    });
    try {
      await userService.followUser(id);
      dispatch({
        type: FOLLOW_USER_SUCCESS,
        payload: { id: id, username: username },
      });
    } catch (error) {
      dispatch({
        type: FOLLOW_USER_FAIL,
        payload: null,
      });
      console.log(error);
    }
  };

export const unfollowUser =
  (id: string, username: string) => async (dispatch: any) => {
    dispatch({
      type: UNFOLLOW_USER_REQUEST,
      payload: null,
    });
    try {
      await userService.unfollowUser(id);
      dispatch({
        type: UNFOLLOW_USER_SUCCESS,
        payload: { id: id, username: username },
      });
    } catch (error) {
      dispatch({
        type: UNFOLLOW_USER_FAIL,
        payload: null,
      });
      console.log(error);
    }
  };
