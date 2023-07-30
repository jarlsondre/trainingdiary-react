import { RETRIEVE_USER, SEARCH_USERS } from "./types";
import userService from "../services/user.service";

export const fetchUser = () => async (dispatch: any) => {
  // NOTE: This is never being used atm
  try {
    userService
      .fetchUser()
      .then((res: any) => {
        dispatch({
          type: RETRIEVE_USER,
          payload: res,
        });
      })
      .catch((err) => {
        dispatch({
          type: RETRIEVE_USER,
          payload: null,
        });
      });
  } catch (err) {}
};
