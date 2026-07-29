import type { AnyAction } from "@reduxjs/toolkit";

import {
  CLEAR_SEARCH_USERS,
  SEARCH_USERS_FAILURE,
  SEARCH_USERS_SUCCESS,
} from "../actions/types";
import type { AccountSummaryInterface } from "../types/models";

export interface SearchUsersState {
  searchResults: AccountSummaryInterface[];
  searchCursor: string;
}

const initialState: SearchUsersState = {
  searchResults: [],
  searchCursor: "",
};

export default function searchedUsersReducer(
  state: SearchUsersState = initialState,
  action: AnyAction,
): SearchUsersState {
  switch (action.type) {
    case SEARCH_USERS_SUCCESS:
      return {
        searchResults: action.payload.data.results as AccountSummaryInterface[],
        searchCursor: "",
      };

    case SEARCH_USERS_FAILURE:
    case CLEAR_SEARCH_USERS:
      return action.payload as SearchUsersState;

    default:
      return state;
  }
}
