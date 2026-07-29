import type { NewSetData, UpdateSetData } from "../services/set.service";
import SetDataService from "../services/set.service";
import type { AppDispatch } from "../store";
import type { SetInterface } from "../types/models";
import { ADD_SET, DELETE_SET, UPDATE_SET } from "./types";

export const addSet = (data: NewSetData) => async (dispatch: AppDispatch) => {
  try {
    const res = await SetDataService.addSet(data);

    dispatch({
      type: ADD_SET,
      payload: res.data,
    });
  } catch (err) {
    console.log(err);
  }
};

export const deleteSet =
  (data: SetInterface) => async (dispatch: AppDispatch) => {
    try {
      await SetDataService.deleteSet(data.id);

      dispatch({
        type: DELETE_SET,
        payload: data,
      });
    } catch (err) {
      console.log(err);
    }
  };

export const updateSet =
  (data: UpdateSetData) => async (dispatch: AppDispatch) => {
    try {
      await SetDataService.updateSet(data);

      dispatch({
        type: UPDATE_SET,
        payload: data,
      });
    } catch (err) {
      console.log(err);
    }
  };
