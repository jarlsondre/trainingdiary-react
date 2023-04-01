import {
  ADD_EXERCISE_UNIT,
  ADD_SESSION_FAIL,
  ADD_SESSION_REQUEST,
  ADD_SESSION_SUCCESS,
  ADD_SET,
  DELETE_EXERCISE_UNIT,
  DELETE_SESSION,
  DELETE_SET,
  LIKE_SESSION_FAIL,
  LIKE_SESSION_REQUEST,
  LIKE_SESSION_SUCCESS,
  RETRIEVE_SESSIONS,
  RETRIEVE_SINGLE_SESSION_FAIL,
  RETRIEVE_SINGLE_SESSION_REQUEST,
  RETRIEVE_SINGLE_SESSION_SUCCESS,
  UPDATE_SESSION_FAIL,
  UPDATE_SESSION_REQUEST,
  UPDATE_SESSION_SUCCESS,
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
  moreToLoad: true,
};

export default function sessionReducer(
  sessions = initialState,
  action: ActionType
) {
  const { type, payload } = action;
  let sessionId = sessions.selectedSession.id;
  let filteredSessionList = [
    ...sessions.sessionList.filter((session: any) => session.id !== sessionId),
  ];

  switch (type) {
    case RETRIEVE_SESSIONS:
      // Pagination stuff
      let newSessions = [];
      let existingSessionIds = sessions.sessionList.map(
        (session: any) => session.id
      );
      for (const session of payload.results) {
        if (existingSessionIds.includes(session.id)) continue;
        newSessions.push(session);
      }
      let moreToLoad = false;
      let cursor: any = "";
      if (payload.next) {
        let url = new URLSearchParams(payload.next.split("?")[1]);
        cursor = url.get("cursor");
        moreToLoad = true;
      }
      return {
        ...sessions,
        sessionList: [...sessions.sessionList, ...newSessions],
        moreToLoad: moreToLoad,
        cursor: cursor,
      };

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
      let sessionAddedExerciseUnit = {
        ...sessions.selectedSession,
        exercise_unit: [...sessions.selectedSession.exercise_unit, payload],
      };

      return {
        ...sessions,
        sessionList: [...filteredSessionList, sessionAddedExerciseUnit],
        selectedSession: {
          sessionAddedExerciseUnit,
        },
      };

    case DELETE_EXERCISE_UNIT:
      // Make sure we update both on selected session and sessionList
      let sessionRemovedExerciseUnit = {
        ...sessions.selectedSession,
        exercise_unit: sessions.selectedSession.exercise_unit.filter(
          (e: any) => e.id !== payload
        ),
      };
      return {
        ...sessions,
        sessionList: [...filteredSessionList, sessionRemovedExerciseUnit],
        selectedSession: sessionRemovedExerciseUnit,
      };

    case ADD_SET:
      let SessionAddSet = {
        ...sessions.selectedSession,
        exercise_unit: sessions.selectedSession.exercise_unit.map((e: any) => {
          return e.id === payload.exercise_unit
            ? { ...e, set: [...e.set, payload] }
            : e;
        }),
      };
      return {
        ...sessions,
        sessionList: [...filteredSessionList, SessionAddSet],
        selectedSession: SessionAddSet,
      };

    case UPDATE_SET:
      let sessionUpdateSet = {
        ...sessions.selectedSession,
        exercise_unit: sessions.selectedSession.exercise_unit.map((e: any) => {
          return e.set.map((s: any) => s.id).includes(payload.id)
            ? {
                ...e,
                set: [
                  ...e.set.filter((s: any) => s.id !== payload.id),
                  payload,
                ],
              }
            : e;
        }),
      };
      return {
        ...sessions,
        sessionList: [...filteredSessionList, sessionUpdateSet],
        selectedSession: sessionUpdateSet,
      };

    case DELETE_SET:
      let sessionDeleteSet = {
        ...sessions.selectedSession,
        exercise_unit: sessions.selectedSession.exercise_unit.map((e: any) => {
          return e.set.map((s: any) => s.id).includes(payload.id)
            ? { ...e, set: e.set.filter((s: any) => s.id !== payload.id) }
            : e;
        }),
      };
      return {
        ...sessions,
        sessionList: [...filteredSessionList, sessionDeleteSet],
        selectedSession: sessionDeleteSet,
      };
    case LIKE_SESSION_REQUEST:
      return { ...sessions };

    case LIKE_SESSION_SUCCESS:
      return {
        ...sessions,
        sessionList: [filteredSessionList, payload],
      };

    case LIKE_SESSION_FAIL:
      return { ...sessions };

    case UPDATE_SESSION_REQUEST:
      return {
        ...sessions,
        selectedSession: { ...sessions.selectedSession, isLoading: true },
      };

    case UPDATE_SESSION_SUCCESS:
      console.log(payload);
      return {
        ...sessions,
        sessionList: [...filteredSessionList, payload],
        selectedSession: { ...payload, isLoading: false },
      };

    case UPDATE_SESSION_FAIL:
      return {
        ...sessions,
        selectedSession: { ...sessions.selectedSession, isLoading: false },
      };

    default:
      return sessions;
  }
}
