import { RETRIEVE_SESSIONS, RETRIEVE_SINGLE_SESSION } from "./types";
import SessionDataService from "../services/session.service";

export const retrieveSessions = () => async (dispatch: any) => {
  try {
    const res = await SessionDataService.getAll();

    dispatch({
      type: RETRIEVE_SESSIONS,
      payload: res.data,
    });
  } catch (err) {
    console.log(err);
  }
};

export const retrieveSingleSession = (id: number) => async (dispatch: any) => {
  try {
    const res = await SessionDataService.getOne(id);

    dispatch({
      type: RETRIEVE_SINGLE_SESSION,
      payload: res.data,
    });
  } catch (err) {
    console.log(err);
  }
};
