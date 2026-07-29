import {
  AUTH_ERROR,
  CONFIRM_PASSWORD_FAIL,
  CONFIRM_PASSWORD_SUCCESS,
  LOGIN_FAIL,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT,
  RESET_PASSWORD_FAIL,
  RESET_PASSWORD_SUCCESS,
} from "../actions/types";
import type { AuthenticationState } from "./authentication";
import authReducer from "./authentication";

const initial = (): AuthenticationState =>
  authReducer(undefined, { type: "@@INIT" });

describe("login flow", () => {
  it("starts logged out and not loading", () => {
    const state = initial();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isLoading).toBe(false);
    expect(state.loginFailed).toBe(false);
  });

  it("LOGIN_REQUEST sets loading and clears a previous failure", () => {
    const failed = authReducer(initial(), { type: LOGIN_FAIL });
    const state = authReducer(failed, { type: LOGIN_REQUEST });
    expect(state.isLoading).toBe(true);
    expect(state.loginFailed).toBe(false);
  });

  it("LOGIN_SUCCESS authenticates", () => {
    const state = authReducer(authReducer(initial(), { type: LOGIN_REQUEST }), {
      type: LOGIN_SUCCESS,
    });
    expect(state.isAuthenticated).toBe(true);
    expect(state.isLoading).toBe(false);
  });

  it("LOGIN_FAIL surfaces the failure", () => {
    const state = authReducer(authReducer(initial(), { type: LOGIN_REQUEST }), {
      type: LOGIN_FAIL,
    });
    expect(state.isAuthenticated).toBe(false);
    expect(state.loginFailed).toBe(true);
  });

  it("LOGOUT and AUTH_ERROR both de-authenticate", () => {
    const loggedIn = authReducer(initial(), { type: LOGIN_SUCCESS });
    expect(authReducer(loggedIn, { type: LOGOUT }).isAuthenticated).toBe(false);
    expect(authReducer(loggedIn, { type: AUTH_ERROR }).isAuthenticated).toBe(
      false,
    );
  });
});

describe("password reset flow", () => {
  it("tracks a successful reset request", () => {
    const state = authReducer(initial(), { type: RESET_PASSWORD_SUCCESS });
    expect(state.resetPasswordSuccess).toBe(true);
    expect(state.resetPasswordFail).toBe(false);
  });

  it("tracks a failed reset request", () => {
    const state = authReducer(initial(), { type: RESET_PASSWORD_FAIL });
    expect(state.resetPasswordSuccess).toBe(false);
    expect(state.resetPasswordFail).toBe(true);
  });

  it("confirm success and fail are mutually exclusive", () => {
    const success = authReducer(initial(), { type: CONFIRM_PASSWORD_SUCCESS });
    expect(success.confirmPasswordSuccess).toBe(true);
    expect(success.confirmPasswordFail).toBe(false);

    const fail = authReducer(success, { type: CONFIRM_PASSWORD_FAIL });
    expect(fail.confirmPasswordSuccess).toBe(false);
    expect(fail.confirmPasswordFail).toBe(true);
  });
});
