import { SEARCH_USERS_SUCCESS, SEARCH_USERS_FAILURE } from "./types";
import userService from "../services/user.service";

export const searchUsers =
  (cursor: string | null, searchString: string | null) =>
  async (dispatch: any) => {
    try {
      userService.searchUsers(cursor, searchString).then((res: any) => {
        dispatch({
          type: SEARCH_USERS_SUCCESS,
          payload: res,
        });
      });
    } catch (err) {
      dispatch({
        type: SEARCH_USERS_FAILURE,
        payload: {
          searchResults: [], // Initialize searchResults as an empty array
          searchCursor: "", // Initialize searchCursor as an empty string
        },
      });
      console.log("Searching for users failed, err:", err);
    }
  };
