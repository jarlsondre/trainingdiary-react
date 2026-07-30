import UserService, { type LoginData } from "../services/user.service";
import type { AuthTokens } from "../types/models";

export const login = (data: LoginData): Promise<AuthTokens> =>
  UserService.login(data).then((r) => r.data);

export const refreshTokens = (refreshToken: string): Promise<AuthTokens> =>
  UserService.refresh(refreshToken).then((r) => r.data);

export const requestPasswordReset = (email: string) =>
  UserService.resetPassword(email).then((r) => r.data);

export const confirmPasswordReset = (
  username: string,
  token: string,
  newPassword: string,
) =>
  UserService.confirmPassword(username, token, newPassword).then((r) => r.data);
