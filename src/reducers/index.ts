import { combineReducers } from "@reduxjs/toolkit";

import sessions from "./sessions";
import exercises from "./exercises";
import authentication from "./authentication";

export default combineReducers({
  sessions,
  exercises,
  authentication,
});
