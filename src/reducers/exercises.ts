import { RETRIEVE_EXERCISES } from "../actions/types";

const initialState: any[] = [];

type ActionType = {
  type: string;
  payload: any;
};

export default function exerciseReducer(
  exercises = initialState,
  action: ActionType
) {
  const { type, payload } = action;
  switch (type) {
    case RETRIEVE_EXERCISES:
      return payload;

    default:
      return exercises;
  }
}
