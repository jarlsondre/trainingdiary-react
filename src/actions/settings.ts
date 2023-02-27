import { TOGGLE_METRIC } from "./types";

export const toggleMetric = (value: boolean) => async (dispatch: any) => {
  try {
    dispatch({
      type: TOGGLE_METRIC,
      payload: { metric: value },
    });
  } catch (err) {
    console.log(err);
  }
};
