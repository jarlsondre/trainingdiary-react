import { RETRIEVE_USER } from "./types";
import userService from "../services/user.service";

export const fetchUser = () => async (dispatch: any) => {
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
