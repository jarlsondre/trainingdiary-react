import { RETRIEVE_EXERCISES } from "./types";
import exerciseService from "../services/exercise.service";

export const retrieveExercises = () => async (dispatch: any) => {
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
