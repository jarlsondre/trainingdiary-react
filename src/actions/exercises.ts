import exerciseService from "../services/exercise.service";
import type { AppDispatch } from "../store";
import { RETRIEVE_EXERCISES } from "./types";

export const retrieveExercises = () => async (dispatch: AppDispatch) => {
  try {
    const res = await exerciseService.getExercises();

    dispatch({
      type: RETRIEVE_EXERCISES,
      payload: res.data,
    });
  } catch (err) {
    console.log(err);
  }
};
