import { combineReducers } from "@reduxjs/toolkit";

import sessions from "./sessions";
import exercises from "./exercises";
import authentication from "./authentication";
import settings from "./settings";
import user from "./user";

export default combineReducers({
  sessions,
  exercises,
  settings,
  authentication,
  user,
});
