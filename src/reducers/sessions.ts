import { RETRIEVE_SESSIONS } from "../actions/types";

type ActionType = {
  type: string;
  payload: any;
};

const initialState: any[] = [];

export default function sessionReducer(
  sessions = initialState,
  action: ActionType
) {
  const { type, payload } = action;

  switch (type) {
    case RETRIEVE_SESSIONS:
      return payload;

    default:
      return sessions;
  }
}
