import userService from "../services/user.service";
import type { AppDispatch } from "../store";
import { SEARCH_USERS_FAILURE, SEARCH_USERS_SUCCESS } from "./types";

export const searchUsers =
  (cursor: string | null, searchString: string | null) =>
  async (dispatch: AppDispatch) => {
    try {
      const res = await userService.searchUsers(cursor, searchString);
      dispatch({
        type: SEARCH_USERS_SUCCESS,
        payload: res,
      });
    } catch (err) {
      dispatch({
        type: SEARCH_USERS_FAILURE,
        payload: {
          searchResults: [],
          searchCursor: "",
        },
      });
      console.log("Searching for users failed, err:", err);
    }
  };
