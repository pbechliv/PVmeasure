import * as types from "./types";

export const setAuthStatus = (status, userId) => ({
  type: types.SET_AUTH_STATUS,
  status,
  userId
});
