import * as types from "./types";

export const setAuthStatus = status => ({
  type: types.SET_AUTH_STATUS,
  status
});
