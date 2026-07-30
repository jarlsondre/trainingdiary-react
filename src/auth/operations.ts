import * as authApi from "../api/auth";
import { queryKeys } from "../queries/keys";
import { queryClient } from "../queryClient";
import type { LoginData } from "../services/user.service";
import { useAuthStore } from "../stores/auth";

const AUTH_TOKEN_KEY = "authToken";

// After auth changes we just invalidate/clear the personalUser query; the
// usePersonalUser hook (enabled by isAuthenticated) refetches on its own. This
// decouples login from the personal-user fetch that the old thunks bundled.

export async function login(data: LoginData): Promise<void> {
  const auth = useAuthStore.getState();
  auth.loginRequest();
  try {
    const tokens = await authApi.login(data);
    localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify(tokens));
    auth.loginSuccess();
    queryClient.invalidateQueries({ queryKey: queryKeys.personalUser() });
  } catch {
    auth.loginFail();
  }
}

export async function refresh(token: string): Promise<void> {
  const auth = useAuthStore.getState();
  try {
    const tokens = await authApi.refreshTokens(token);
    localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify(tokens));
    auth.loginSuccess();
    queryClient.invalidateQueries({ queryKey: queryKeys.personalUser() });
  } catch {
    auth.loggedOut();
  }
}

export function logout(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  useAuthStore.getState().loggedOut();
  queryClient.removeQueries({ queryKey: queryKeys.personalUser() });
}

export async function requestPasswordReset(email: string): Promise<void> {
  const auth = useAuthStore.getState();
  auth.resetRequest();
  try {
    await authApi.requestPasswordReset(email);
    auth.resetSuccess();
  } catch {
    auth.resetFail();
  }
}

export async function confirmPasswordReset(
  username: string,
  token: string,
  newPassword: string,
): Promise<void> {
  const auth = useAuthStore.getState();
  auth.confirmRequest();
  try {
    await authApi.confirmPasswordReset(username, token, newPassword);
    auth.confirmSuccess();
  } catch {
    auth.confirmFail();
  }
}
