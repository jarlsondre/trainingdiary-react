import { RETRIEVE_USER } from "../actions/types";

type ActionType = {
  type: string;
  payload: any;
};

export default function userReducer(user = [], action: ActionType) {
  const { type, payload } = action;
  switch (type) {
    case RETRIEVE_USER:
      return payload;

    default:
      return user;
  }
}
