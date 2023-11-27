import * as Actions from "../actions/types";

type ActionType = {
  type: keyof typeof Actions;
  payload: any;
  replaceStore: boolean;
  username: string | null;
};

const initialState: any = {
  sessionList: [],
  selectedSession: {
    isLoading: false,
  },
  moreToLoad: true,
  profileSessions: {
    results: [],
    moreToLoad: true,
    cursor: "",
    username: "",
  },
};

const ExerciseUnitMapForUpdateSet = (exerciseUnit: any, payload: any) => {
  return exerciseUnit.set.map((set: any) => set.id).includes(payload.id)
    ? {
        ...exerciseUnit,
        set: [
          ...exerciseUnit.set.filter((set: any) => set.id !== payload.id),
          payload,
        ],
      }
    : exerciseUnit;
};

const ExerciseUnitMapForAddSet = (exerciseUnit: any, payload: any) => {
  return exerciseUnit.id === payload.exercise_unit
    ? { ...exerciseUnit, set: [...exerciseUnit.set, payload] }
    : exerciseUnit;
};

const ExerciseUnitMapForDeleteSet = (exerciseUnit: any, payload: any) => {
  return exerciseUnit.set.map((set: any) => set.id).includes(payload.id)
    ? {
        ...exerciseUnit,
        set: exerciseUnit.set.filter((set: any) => set.id !== payload.id),
      }
    : exerciseUnit;
};

const updateSessionWithSet = (state: any, payload: any, actionType: any) => {
  let sessionId = state.selectedSession.id;
  let filteredSessionList = [
    ...state.sessionList.filter((session: any) => session.id !== sessionId),
  ];
  let mapFunction: any;

  // Choosing the correct function for the task
  if (actionType === Actions.ADD_SET) {
    mapFunction = ExerciseUnitMapForAddSet;
  } else if (actionType === Actions.UPDATE_SET) {
    mapFunction = ExerciseUnitMapForUpdateSet;
  } else if (actionType === Actions.DELETE_SET) {
    mapFunction = ExerciseUnitMapForDeleteSet;
  }

  // Filtering choosing the new set
  let newSet = {
    ...state.selectedSession,
    exercise_unit: state.selectedSession.exercise_unit.map(
      (exerciseUnit: any) => mapFunction(exerciseUnit, payload)
    ),
  };
  return {
    ...state,
    sessionList: [...filteredSessionList, newSet],
    selectedSession: newSet,
  };
};

const getUpdatedSessionList = (sessionList: any, payload: any) => {
  let newSessions = [];
  let existingSessionIds = sessionList.map((session: any) => session.id);
  for (const session of payload.results) {
    if (existingSessionIds.includes(session.id)) continue;
    newSessions.push(session);
  }
  return [...sessionList, ...newSessions];
};

export default function sessionReducer(
  sessions = initialState,
  action: ActionType
) {
  const { payload } = action;
  let sessionId = sessions.selectedSession.id;
  let filteredSessionList = [
    ...sessions.sessionList.filter((session: any) => session.id !== sessionId),
  ];
  let moreToLoad = false;
  let cursor: string | null = null;
  let updatedSessionList = [];
  let replaceStore: boolean = false;

  switch (action.type) {
    case Actions.RETRIEVE_SESSIONS:
      // Pagination stuff
      replaceStore = action.replaceStore;
      cursor = "";

      if (replaceStore) {
        updatedSessionList = payload.results;
      } else {
        updatedSessionList = getUpdatedSessionList(
          sessions.sessionList,
          payload
        );
      }

      // Cursor stuff
      if (payload.next) {
        let url = new URLSearchParams(payload.next.split("?")[1]);
        cursor = url.get("cursor");
        moreToLoad = true;
      }

      return {
        ...sessions,
        sessionList: updatedSessionList,
        moreToLoad: moreToLoad,
        cursor: cursor,
      };

    case Actions.FETCH_USER_SESSIONS:
      replaceStore = action.replaceStore;
      if (payload.next) {
        let url = new URLSearchParams(payload.next.split("?")[1]);
        cursor = url.get("cursor");
        moreToLoad = true;
      }
      if (replaceStore) {
        updatedSessionList = payload.results;
      } else {
        updatedSessionList = getUpdatedSessionList(
          sessions.profileSessions.results,
          payload
        );
      }
      return {
        ...sessions,
        profileSessions: {
          ...sessions.profileSessions,
          results: updatedSessionList,
          moreToLoad: moreToLoad,
          cursor: cursor,
          username: action.username,
        },
      };

    case Actions.UPDATE_PROFILE_USERNAME:
      return {
        ...sessions,
        profileSessions: {
          ...sessions.profileSessions,
          username: payload,
          moreToLoad: true,
          cursor: "",
        },
      };

    case Actions.ADD_SESSION_REQUEST:
    case Actions.ADD_SESSION_FAIL:
      return { ...sessions };

    case Actions.ADD_SESSION_SUCCESS:
      return { ...sessions, sessionList: [...sessions.sessionList, payload] };

    case Actions.RETRIEVE_SINGLE_SESSION_REQUEST:
      return {
        ...sessions,
        selectedSession: { ...sessions.selectedSession, isLoading: true },
      };

    case Actions.RETRIEVE_SINGLE_SESSION_SUCCESS:
      return { ...sessions, selectedSession: { ...payload, isLoading: false } };

    case Actions.RETRIEVE_SINGLE_SESSION_FAIL:
      return {
        ...sessions,
        selectedSession: { ...sessions.selectedSession, isLoading: false },
      };

    case Actions.DELETE_SESSION:
      return {
        ...sessions,
        sessionList: sessions.sessionList.filter(
          (session: any) => session.id !== payload
        ),
      };

    case Actions.ADD_EXERCISE_UNIT:
      let updatedSelectedSession = {
        ...sessions.selectedSession,
        exercise_unit: [...sessions.selectedSession.exercise_unit, payload],
      };

      return {
        ...sessions,
        sessionList: [...filteredSessionList, updatedSelectedSession],
        selectedSession: {
          sessionAddedExerciseUnit: updatedSelectedSession,
        },
      };

    case Actions.DELETE_EXERCISE_UNIT:
      // Make sure we update both on selected session and sessionList
      let sessionRemovedExerciseUnit = {
        ...sessions.selectedSession,
        exercise_unit: sessions.selectedSession.exercise_unit.filter(
          (exerciseUnit: any) => exerciseUnit.id !== payload
        ),
      };
      return {
        ...sessions,
        sessionList: [...filteredSessionList, sessionRemovedExerciseUnit],
        selectedSession: sessionRemovedExerciseUnit,
      };

    case Actions.ADD_SET:
    case Actions.UPDATE_SET:
    case Actions.DELETE_SET:
      return updateSessionWithSet(sessions, payload, action.type);

    case Actions.LIKE_SESSION_REQUEST:
    case Actions.LIKE_SESSION_FAIL:
      return { ...sessions };

    case Actions.LIKE_SESSION_SUCCESS:
      return {
        ...sessions,
        sessionList: [
          ...sessions.sessionList.filter(
            (session: any) => session.id !== payload.id
          ),
          payload,
        ],
      };

    case Actions.UPDATE_SESSION_REQUEST:
      return {
        ...sessions,
        selectedSession: { ...sessions.selectedSession, isLoading: true },
      };

    case Actions.UPDATE_SESSION_SUCCESS:
      return {
        ...sessions,
        sessionList: [...filteredSessionList, payload],
        selectedSession: { ...payload, isLoading: false },
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
