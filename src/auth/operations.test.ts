import { useAuthStore } from "../stores/auth";
import { login, logout, requestPasswordReset } from "./operations";

jest.mock("../api/auth");

import * as authApi from "../api/auth";

beforeEach(() => {
  localStorage.clear();
  useAuthStore.setState({
    isAuthenticated: false,
    isLoading: false,
    loginFailed: false,
    resetPasswordSuccess: false,
    resetPasswordFail: false,
  });
});

describe("auth operations", () => {
  it("login stores tokens and marks the user authenticated", async () => {
    (authApi.login as jest.Mock).mockResolvedValue({
      access: "access-token",
      refresh: "refresh-token",
    });
    await login({ username: "alice", password: "pw" });

    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    expect(useAuthStore.getState().loginFailed).toBe(false);
    expect(localStorage.getItem("authToken")).toContain("access-token");
  });

  it("login failure flags loginFailed and stays unauthenticated", async () => {
    (authApi.login as jest.Mock).mockRejectedValue(new Error("bad creds"));
    await login({ username: "alice", password: "wrong" });

    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useAuthStore.getState().loginFailed).toBe(true);
    expect(localStorage.getItem("authToken")).toBeNull();
  });

  it("logout removes the token (not just blanks it) and de-authenticates", () => {
    localStorage.setItem(
      "authToken",
      JSON.stringify({ access: "a", refresh: "r" }),
    );
    useAuthStore.setState({ isAuthenticated: true });

    logout();

    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    // regression: logout used to write "" instead of removing the key.
    expect(localStorage.getItem("authToken")).toBeNull();
  });

  it("password-reset request flips the success flag", async () => {
    (authApi.requestPasswordReset as jest.Mock).mockResolvedValue(undefined);
    await requestPasswordReset("alice@example.com");

    expect(useAuthStore.getState().resetPasswordSuccess).toBe(true);
    expect(useAuthStore.getState().resetPasswordFail).toBe(false);
  });
});
