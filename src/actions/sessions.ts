import { RETRIEVE_SESSIONS } from "./types";
import SessionDataService from "../services/session.service";

export const retrieveSessions = () => async (dispatch: any) => {
  try {
    const res = await SessionDataService.getAll();

    console.log(res);

    dispatch({
      type: RETRIEVE_SESSIONS,
      payload: res.data,
    });
  } catch (err) {
    console.log(err);
  }
};
