// Domain types mirroring the Django REST API serializers
// (trainingdiary-backend/trainingdiary/*/serializers.py).

export interface SetInterface {
  id: number;
  weight: number;
  repetitions: number;
  set_number: number;
  exercise_unit: number;
}

export interface ExerciseInterface {
  id: number;
  name: string;
}

export interface ExerciseUnitInterface {
  id: number;
  set: SetInterface[];
  exercise_name: string;
  session: number;
  exercise: number;
  comment: string;
}

export interface SessionCommentInterface {
  id: number;
  session: number;
  user: number;
  username: string;
  text: string;
  datetime: string;
}

export interface SessionInterface {
  id: number;
  exercise_unit: ExerciseUnitInterface[];
  description: string;
  datetime: string;
  user: number;
  username: string;
  liked_by_usernames: string[];
  comments: SessionCommentInterface[];
}

export interface AccountSummaryInterface {
  id: number;
  username: string;
}

export type UnitSystem = "kg" | "lbs";

/** Which sessions the main feed shows. */
export type FeedFilter = "all" | "personal" | "following";

export interface AccountInterface {
  id: number;
  username: string;
  email: string;
  bio: string | null;
  first_name: string;
  last_name: string;
  unit_system: UnitSystem;
  followers: AccountSummaryInterface[];
  following: AccountSummaryInterface[];
}

/** Shape of DRF's CursorPagination responses. */
export interface CursorPage<T> {
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface AuthTokens {
  access: string;
  refresh: string;
}
