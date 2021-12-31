import {
  ADD_EXERCISE_UNIT,
  RETRIEVE_SESSIONS,
  RETRIEVE_SINGLE_SESSION,
} from "../actions/types";

type ActionType = {
  type: string;
  payload: any;
};

const initialState: any = {
  sessionList: [],
  selectedSession: {},
};

export default function sessionReducer(
  sessions = initialState,
  action: ActionType
) {
  const { type, payload } = action;

  switch (type) {
    case RETRIEVE_SESSIONS:
      return { ...sessions, sessionList: payload };

    case RETRIEVE_SINGLE_SESSION:
      return { ...sessions, selectedSession: payload };

    case ADD_EXERCISE_UNIT:
      return {
        ...sessions,
        selectedSession: {
          ...sessions.selectedSession,
          exercise_units: [...sessions.selectedSession.exercise_unit, payload],
        },
      };

    default:
      return sessions;
  }
}
