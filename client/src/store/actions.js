import * as types from "./types";

export const setAuthStatus = (status, userId, username) => ({
  type: types.SET_AUTH_STATUS,
  status,
  userId,
  username
});

export const setGroups = groups => ({
  type: types.SET_GROUPS,
  groups
});

export const addGroup = group => ({
  type: types.ADD_GROUP,
  group
});

export const removeGroup = group => ({
  type: types.REMOVE_GROUP,
  group
});

export const setCurrentGroup = group => ({
  type: types.SET_CURRENT_GROUP,
  group
});
