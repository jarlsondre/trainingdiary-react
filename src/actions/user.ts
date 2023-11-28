import {
  FETCH_USER_FAIL,
  FETCH_USER_REQUEST,
  FETCH_USER_SUCCESS,
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
