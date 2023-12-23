import {
  ADD_EXERCISE_UNIT,
  DELETE_EXERCISE_UNIT,
  UPDATE_EXERCISE_UNIT,
} from "./types";
import ExerciseUnitDataService from "../services/exerciseUnit.service";

export const addExerciseUnit = (data: any) => async (dispatch: any) => {
  try {
    const res = await ExerciseUnitDataService.addExerciseUnit(data);
    dispatch({
      type: ADD_EXERCISE_UNIT,
      payload: res.data,
    });
  } catch (err) {
    console.log(err);
  }
};

export const deleteExerciseUnit = (id: any) => async (dispatch: any) => {
  try {
    await ExerciseUnitDataService.deleteExerciseUnit(id);

    dispatch({
      type: DELETE_EXERCISE_UNIT,
      payload: id,
    });
  } catch (err) {
    console.log(err);
  }
};

export const updateExerciseUnit =
  (id: any, data: any) => async (dispatch: any) => {
    try {
      const res = await ExerciseUnitDataService.updateExerciseUnit(id, data);
      dispatch({
        type: UPDATE_EXERCISE_UNIT,
        payload: res.data,
      });
    } catch (err) {
      console.log(err);
    }
  };
