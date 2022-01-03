import { addSet } from "../actions/sets";
import {
  ADD_EXERCISE_UNIT,
  ADD_SESSION_FAIL,
  ADD_SESSION_REQUEST,
  ADD_SESSION_SUCCESS,
  ADD_SET,
  DELETE_EXERCISE_UNIT,
  DELETE_SESSION,
  DELETE_SET,
  RETRIEVE_SESSIONS,
  RETRIEVE_SINGLE_SESSION_FAIL,
  RETRIEVE_SINGLE_SESSION_REQUEST,
  RETRIEVE_SINGLE_SESSION_SUCCESS,
  UPDATE_SET,
} from "../actions/types";

type ActionType = {
  type: string;
  payload: any;
};

const initialState: any = {
  sessionList: [],
  selectedSession: {
    isLoading: false,
  },
};

export default function sessionReducer(
  sessions = initialState,
  action: ActionType
) {
  const { type, payload } = action;

  switch (type) {
    case RETRIEVE_SESSIONS:
      return { ...sessions, sessionList: payload };

    case ADD_SESSION_REQUEST:
      return { ...sessions };

    case ADD_SESSION_SUCCESS:
      return { ...sessions, sessionList: [...sessions.sessionList, payload] };

    case ADD_SESSION_FAIL:
      return { ...sessions };

    case RETRIEVE_SINGLE_SESSION_REQUEST:
      return {
        ...sessions,
        selectedSession: { ...sessions.selectedSession, isLoading: true },
      };

    case RETRIEVE_SINGLE_SESSION_SUCCESS:
      return { ...sessions, selectedSession: { ...payload, isLoading: false } };

    case RETRIEVE_SINGLE_SESSION_FAIL:
      return {
        ...sessions,
        selectedSession: { ...sessions.selectedSession, isLoading: false },
      };

    case DELETE_SESSION:
      return {
        ...sessions,
        sessionList: sessions.sessionList.filter((s: any) => s.id !== payload),
      };

    case ADD_EXERCISE_UNIT:
      return {
        ...sessions,
        selectedSession: {
          ...sessions.selectedSession,
          exercise_unit: [...sessions.selectedSession.exercise_unit, payload],
        },
      };

    case DELETE_EXERCISE_UNIT:
      return {
        ...sessions,
        selectedSession: {
          ...sessions.selectedSession,
          exercise_unit: sessions.selectedSession.exercise_unit.filter(
            (e: any) => e.id !== payload
          ),
        },
      };

    case ADD_SET:
      return {
        ...sessions,
        selectedSession: {
          ...sessions.selectedSession,
          exercise_unit: sessions.selectedSession.exercise_unit.map(
            (e: any) => {
              return e.id === payload.exercise_unit
                ? { ...e, set: [...e.set, payload] }
                : e;
            }
          ),
        },
      };

    case UPDATE_SET:
      return {
        ...sessions,
        selectedSession: {
          ...sessions.selectedSession,
          exercise_unit: sessions.selectedSession.exercise_unit.map(
            (e: any) => {
              return e.id === payload.exercise_unit
                ? {
                    ...e,
                    set: [
                      ...e.set.filter((s: any) => s.id !== payload.id),
                      payload,
                    ],
                  }
                : e;
            }
          ),
        },
      };

    case DELETE_SET:
      return {
        ...sessions,
        selectedSession: {
          ...sessions.selectedSession,
          exercise_unit: sessions.selectedSession.exercise_unit.map(
            (e: any) => {
              return e.id === payload.exercise_unit
                ? { ...e, set: e.set.filter((s: any) => s.id !== payload.id) }
                : e;
            }
          ),
        },
      };

    default:
      return sessions;
  }
}
