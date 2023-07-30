import {
  CLEAR_SEARCH_USERS,
  SEARCH_USERS_FAILURE,
  SEARCH_USERS_SUCCESS,
} from "../actions/types";

type ActionType = {
  type: string;
  payload: any;
};

export default function searchedUsersReducer(
  defaultUsers = [],
  action: ActionType
) {
  const { type, payload } = action;
  switch (type) {
    case SEARCH_USERS_SUCCESS:
      return {
        searchResults: payload.data.results, // Initialize searchResults as an empty array
        searchCursor: "", // Initialize searchCursor as an empty string
      };

    case SEARCH_USERS_FAILURE:
      // Payload will be []
      return payload;

    case CLEAR_SEARCH_USERS:
      // Payload will be []
      return payload;

    default:
      return defaultUsers;
  }
}
