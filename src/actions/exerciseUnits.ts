import type { NewExerciseUnit } from "../services/exerciseUnit.service";
import ExerciseUnitDataService from "../services/exerciseUnit.service";
import type { AppDispatch } from "../store";
import type { ExerciseUnitInterface } from "../types/models";
import {
  ADD_EXERCISE_UNIT,
  DELETE_EXERCISE_UNIT,
  UPDATE_EXERCISE_UNIT,
} from "./types";

export const addExerciseUnit =
  (data: NewExerciseUnit) => async (dispatch: AppDispatch) => {
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

export const deleteExerciseUnit =
  (id: number) => async (dispatch: AppDispatch) => {
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
  (id: number, data: Partial<ExerciseUnitInterface>) =>
  async (dispatch: AppDispatch) => {
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
