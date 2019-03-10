import * as types from "./types";

export const setAuthStatus = (status, userId) => ({
  type: types.SET_AUTH_STATUS,
  status,
  userId
});

export const setGroups = groups => ({
  type: types.SET_GROUPS,
  groups
});

export const addGroup = group => ({
  type: types.ADD_GROUP,
  group
});
