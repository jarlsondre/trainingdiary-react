import { createStore, applyMiddleware } from "@reduxjs/toolkit";
import rootReducer from "./reducers";
import thunk from "redux-thunk";

import { composeWithDevTools } from "redux-devtools-extension";

const initialState = {
  sessions: {
    sessionList: [],
    selectedSession: {
      isLoading: false,
    },
    moreToLoad: true,
    cursor: "",
  },
  exercises: [],
  user: {},
  settings: {
    metric: false,
  },
};

const middleware = [thunk];

const store = createStore(
  rootReducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
