import type { AnyAction } from "@reduxjs/toolkit";

import { RETRIEVE_EXERCISES } from "../actions/types";
import type { ExerciseInterface } from "../types/models";

const initialState: ExerciseInterface[] = [];

export default function exerciseReducer(
  exercises: ExerciseInterface[] = initialState,
  action: AnyAction,
): ExerciseInterface[] {
  switch (action.type) {
    case RETRIEVE_EXERCISES:
      return action.payload as ExerciseInterface[];

    default:
      return exercises;
  }
}
