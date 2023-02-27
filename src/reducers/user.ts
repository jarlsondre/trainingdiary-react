import { RETRIEVE_USER } from "../actions/types";

type User = {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  bio: string;
};

const initialState: User = {
  id: 0,
  username: "No User",
  first_name: "No User",
  last_name: "No User",
  bio: "No User",
};

type ActionType = {
  type: string;
  payload: any;
};

export default function userReducer(user = initialState, action: ActionType) {
  const { type, payload } = action;
  switch (type) {
    case RETRIEVE_USER:
      return payload;

    default:
      return user;
  }
}
