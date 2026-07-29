import { combineReducers } from "@reduxjs/toolkit";
import authentication from "./authentication";
import exercises from "./exercises";
import searchUsers from "./searchUsers";
import sessions from "./sessions";
import user from "./user";

export default combineReducers({
  sessions,
  exercises,
  authentication,
  user,
  searchUsers,
});
