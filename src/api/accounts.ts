import UserService from "../services/user.service";
import type { AccountInterface } from "../types/models";

export const getPersonalUser = () =>
  UserService.fetchPersonalUser().then((r) => r.data);

export const getAccount = (username: string) =>
  UserService.fetchUser(username).then((r) => r.data);

export const updateAccount = (id: number, data: Partial<AccountInterface>) =>
  UserService.updateUser(id, data).then((r) => r.data);

export const searchAccounts = (cursor: string | null, term: string) =>
  UserService.searchUsers(cursor, term).then((r) => r.data);

export const followAccount = (id: number) =>
  UserService.followUser(id).then((r) => r.data);

export const unfollowAccount = (id: number) =>
  UserService.unfollowUser(id).then((r) => r.data);
