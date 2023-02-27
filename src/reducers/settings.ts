import { TOGGLE_METRIC } from "../actions/types";

const initialState: any = {
  metric: false,
};

type ActionType = {
  type: string;
  payload: any;
};

export default function settingsReducer(
  settings = initialState,
  action: ActionType
) {
  const { type, payload } = action;
  switch (type) {
    case TOGGLE_METRIC:
      return payload;

    default:
      return settings;
  }
}
