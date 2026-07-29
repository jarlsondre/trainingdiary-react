import type { AnyAction } from "@reduxjs/toolkit";

import * as Actions from "../actions/types";
import type {
  CursorPage,
  ExerciseUnitInterface,
  SessionInterface,
  SetInterface,
} from "../types/models";

/** The session currently open in the detail view; empty before one is loaded. */
export type SelectedSessionState = Partial<SessionInterface> & {
  isLoading: boolean;
};

export interface ProfileSessionsState {
  results: SessionInterface[];
  moreToLoad: boolean;
  cursor: string | null;
  username: string;
}

export interface SessionsState {
  sessionList: SessionInterface[];
  selectedSession: SelectedSessionState;
  moreToLoad: boolean;
  cursor: string | null;
  profileSessions: ProfileSessionsState;
}

const initialState: SessionsState = {
  sessionList: [],
  selectedSession: {
    isLoading: false,
  },
  moreToLoad: true,
  cursor: "",
  profileSessions: {
    results: [],
    moreToLoad: true,
    cursor: "",
    username: "",
  },
};

const ExerciseUnitMapForUpdateSet = (
  exerciseUnit: ExerciseUnitInterface,
  payload: SetInterface,
): ExerciseUnitInterface => {
  return exerciseUnit.set.map((set) => set.id).includes(payload.id)
    ? {
        ...exerciseUnit,
        set: [
          ...exerciseUnit.set.filter((set) => set.id !== payload.id),
          payload,
        ],
      }
    : exerciseUnit;
};

const ExerciseUnitMapForAddSet = (
  exerciseUnit: ExerciseUnitInterface,
  payload: SetInterface,
): ExerciseUnitInterface => {
  return exerciseUnit.id === payload.exercise_unit
    ? { ...exerciseUnit, set: [...exerciseUnit.set, payload] }
    : exerciseUnit;
};

const ExerciseUnitMapForDeleteSet = (
  exerciseUnit: ExerciseUnitInterface,
  payload: SetInterface,
): ExerciseUnitInterface => {
  return exerciseUnit.set.map((set) => set.id).includes(payload.id)
    ? {
        ...exerciseUnit,
        set: exerciseUnit.set.filter((set) => set.id !== payload.id),
      }
    : exerciseUnit;
};

const updateSessionWithSet = (
  state: SessionsState,
  payload: SetInterface,
  actionType: string,
): SessionsState => {
  const sessionId = state.selectedSession.id;
  const filteredSessionList = state.sessionList.filter(
    (session) => session.id !== sessionId,
  );
  let mapFunction: (
    exerciseUnit: ExerciseUnitInterface,
    payload: SetInterface,
  ) => ExerciseUnitInterface;

  // Choosing the correct function for the task
  if (actionType === Actions.ADD_SET) {
    mapFunction = ExerciseUnitMapForAddSet;
  } else if (actionType === Actions.UPDATE_SET) {
    mapFunction = ExerciseUnitMapForUpdateSet;
  } else if (actionType === Actions.DELETE_SET) {
    mapFunction = ExerciseUnitMapForDeleteSet;
  } else {
    return state;
  }

  const newSelectedSession = {
    ...state.selectedSession,
    exercise_unit: (state.selectedSession.exercise_unit ?? []).map(
      (exerciseUnit) => mapFunction(exerciseUnit, payload),
    ),
  };
  return {
    ...state,
    sessionList: [
      ...filteredSessionList,
      newSelectedSession as SessionInterface,
    ],
    selectedSession: newSelectedSession,
  };
};

const getUpdatedSessionList = (
  sessionList: SessionInterface[],
  payload: CursorPage<SessionInterface>,
): SessionInterface[] => {
  const newSessions = [];
  const existingSessionIds = sessionList.map((session) => session.id);
  for (const session of payload.results) {
    if (existingSessionIds.includes(session.id)) continue;
    newSessions.push(session);
  }
  return [...sessionList, ...newSessions];
};

/** Reads the cursor out of a DRF `next` pagination link. */
const cursorFromNextLink = (next: string | null): string | null => {
  if (!next) return null;
  const url = new URLSearchParams(next.split("?")[1]);
  return url.get("cursor");
};

export default function sessionReducer(
  sessions: SessionsState = initialState,
  action: AnyAction,
): SessionsState {
  const sessionId = sessions.selectedSession.id;
  const filteredSessionList = sessions.sessionList.filter(
    (session) => session.id !== sessionId,
  );

  switch (action.type) {
    case Actions.RETRIEVE_SESSIONS: {
      const payload = action.payload as CursorPage<SessionInterface>;
      const updatedSessionList = action.replaceStore
        ? payload.results
        : getUpdatedSessionList(sessions.sessionList, payload);
      const cursor = cursorFromNextLink(payload.next);

      return {
        ...sessions,
        sessionList: updatedSessionList,
        moreToLoad: cursor !== null,
        cursor: cursor,
      };
    }

    case Actions.FETCH_USER_SESSIONS: {
      const payload = action.payload as CursorPage<SessionInterface>;
      const cursor = cursorFromNextLink(payload.next);
      const updatedSessionList = action.replaceStore
        ? payload.results
        : getUpdatedSessionList(sessions.profileSessions.results, payload);
      return {
        ...sessions,
        profileSessions: {
          ...sessions.profileSessions,
          results: updatedSessionList,
          moreToLoad: cursor !== null,
          cursor: cursor,
          username: action.username as string,
        },
      };
    }

    case Actions.UPDATE_PROFILE_USERNAME:
      return {
        ...sessions,
        profileSessions: {
          ...sessions.profileSessions,
          username: action.payload as string,
          moreToLoad: true,
          cursor: "",
        },
      };

    case Actions.ADD_SESSION_REQUEST:
    case Actions.ADD_SESSION_FAIL:
      return { ...sessions };

    case Actions.ADD_SESSION_SUCCESS:
      return {
        ...sessions,
        sessionList: [
          ...sessions.sessionList,
          action.payload as SessionInterface,
        ],
      };

    case Actions.RETRIEVE_SINGLE_SESSION_REQUEST:
      return {
        ...sessions,
        selectedSession: { ...sessions.selectedSession, isLoading: true },
      };

    case Actions.RETRIEVE_SINGLE_SESSION_SUCCESS:
      return {
        ...sessions,
        selectedSession: {
          ...(action.payload as SessionInterface),
          isLoading: false,
        },
      };

    case Actions.RETRIEVE_SINGLE_SESSION_FAIL:
      return {
        ...sessions,
        selectedSession: { ...sessions.selectedSession, isLoading: false },
      };

    case Actions.DELETE_SESSION:
      return {
        ...sessions,
        sessionList: sessions.sessionList.filter(
          (session) => session.id !== (action.payload as number),
        ),
      };

    case Actions.ADD_EXERCISE_UNIT: {
      const updatedSelectedSession = {
        ...sessions.selectedSession,
        exercise_unit: [
          ...(sessions.selectedSession.exercise_unit ?? []),
          action.payload as ExerciseUnitInterface,
        ],
      };

      return {
        ...sessions,
        sessionList: [
          ...filteredSessionList,
          updatedSelectedSession as SessionInterface,
        ],
        // Preserved quirk: selectedSession loses its fields here (the session
        // ends up nested under an unread key), which makes the detail view
        // re-fetch from the server. Candidate cleanup for a behavior pass.
        selectedSession: {
          sessionAddedExerciseUnit: updatedSelectedSession,
          isLoading: false,
        } as SelectedSessionState,
      };
    }

    case Actions.DELETE_EXERCISE_UNIT: {
      const sessionRemovedExerciseUnit = {
        ...sessions.selectedSession,
        exercise_unit: (sessions.selectedSession.exercise_unit ?? []).filter(
          (exerciseUnit) => exerciseUnit.id !== (action.payload as number),
        ),
      };
      return {
        ...sessions,
        sessionList: [
          ...filteredSessionList,
          sessionRemovedExerciseUnit as SessionInterface,
        ],
        selectedSession: sessionRemovedExerciseUnit,
      };
    }

    case Actions.UPDATE_EXERCISE_UNIT: {
      const payload = action.payload as ExerciseUnitInterface;
      const updatedSelectedSession = {
        ...sessions.selectedSession,
        exercise_unit: (sessions.selectedSession.exercise_unit ?? []).map(
          (exerciseUnit) =>
            exerciseUnit.id === payload.id ? payload : exerciseUnit,
        ),
      };
      return {
        ...sessions,
        sessionList: [
          ...filteredSessionList,
          updatedSelectedSession as SessionInterface,
        ],
        selectedSession: updatedSelectedSession,
      };
    }

    case Actions.ADD_SET:
    case Actions.UPDATE_SET:
    case Actions.DELETE_SET:
      return updateSessionWithSet(
        sessions,
        action.payload as SetInterface,
        action.type,
      );

    case Actions.LIKE_SESSION_REQUEST:
    case Actions.LIKE_SESSION_FAIL:
      return { ...sessions };

    case Actions.LIKE_SESSION_SUCCESS: {
      const payload = action.payload as SessionInterface;
      return {
        ...sessions,
        sessionList: [
          ...sessions.sessionList.filter(
            (session) => session.id !== payload.id,
          ),
          payload,
        ],
      };
    }

    case Actions.UPDATE_SESSION_REQUEST:
      return {
        ...sessions,
        selectedSession: { ...sessions.selectedSession, isLoading: true },
      };

    case Actions.UPDATE_SESSION_SUCCESS:
      return {
        ...sessions,
        sessionList: [
          ...filteredSessionList,
          action.payload as SessionInterface,
        ],
        selectedSession: {
          ...(action.payload as SessionInterface),
          isLoading: false,
        },
      };

    case Actions.UPDATE_SESSION_FAIL:
      return {
        ...sessions,
        selectedSession: { ...sessions.selectedSession, isLoading: false },
      };

    default:
      return sessions;
  }
}
