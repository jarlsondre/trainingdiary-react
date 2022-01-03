import { ADD_SET, DELETE_SET, UPDATE_SET } from "./types";
import SetDataService from "../services/set.service";

export const addSet = (data: any) => async (dispatch: any) => {
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

export const deleteSet = (data: any) => async (dispatch: any) => {
  try {
    const res = await SetDataService.deleteSet(data.id);

    dispatch({
      type: DELETE_SET,
      payload: data,
    });
  } catch (err) {
    console.log(err);
  }
};

export const updateSet = (data: any) => async (dispatch: any) => {
  try {
    const res = await SetDataService.updateSet(data);

    dispatch({
      type: UPDATE_SET,
      payload: data,
    });
  } catch (err) {
    console.log(err);
  }
};
