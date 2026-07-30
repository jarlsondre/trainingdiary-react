import { create } from "zustand";

/**
 * Client-side auth state (the only global client state left after the Query
 * migration). Portable: no DOM/router imports, so it carries over to React
 * Native. The transitions mirror the old Redux `authentication` reducer.
 */
interface AuthStore {
  isAuthenticated: boolean;
  isLoading: boolean;
  loginFailed: boolean;
  resetPasswordSuccess: boolean;
  resetPasswordFail: boolean;
  confirmPasswordSuccess: boolean;
  confirmPasswordFail: boolean;

  loginRequest: () => void;
  loginSuccess: () => void;
  loginFail: () => void;
  loggedOut: () => void;
  resetRequest: () => void;
  resetSuccess: () => void;
  resetFail: () => void;
  confirmRequest: () => void;
  confirmSuccess: () => void;
  confirmFail: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: false,
  isLoading: false,
  loginFailed: false,
  resetPasswordSuccess: false,
  resetPasswordFail: false,
  confirmPasswordSuccess: false,
  confirmPasswordFail: false,

  loginRequest: () => set({ isLoading: true, loginFailed: false }),
  loginSuccess: () =>
    set({ isAuthenticated: true, isLoading: false, loginFailed: false }),
  loginFail: () =>
    set({ isAuthenticated: false, isLoading: false, loginFailed: true }),
  loggedOut: () => set({ isAuthenticated: false, isLoading: false }),
  resetRequest: () =>
    set({
      isLoading: true,
      resetPasswordSuccess: false,
      resetPasswordFail: false,
    }),
  resetSuccess: () =>
    set({
      isLoading: false,
      resetPasswordSuccess: true,
      resetPasswordFail: false,
    }),
  resetFail: () =>
    set({
      isLoading: false,
      resetPasswordSuccess: false,
      resetPasswordFail: true,
    }),
  confirmRequest: () =>
    set({
      isLoading: true,
      confirmPasswordSuccess: false,
      confirmPasswordFail: false,
    }),
  confirmSuccess: () =>
    set({
      isLoading: false,
      confirmPasswordSuccess: true,
      confirmPasswordFail: false,
    }),
  confirmFail: () =>
    set({
      isLoading: false,
      confirmPasswordSuccess: false,
      confirmPasswordFail: true,
    }),
}));
