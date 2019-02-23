import { combineReducers } from "redux";
import { reducer as toastrReducer } from "react-redux-toastr";
import * as types from "./types";

const INITIAL_STATE = {
  isAuthenticated: false,
  user: null
};

const setAuthStatus = (state, action) => ({
  ...state,
  isAuthenticated: action.status
});

const mainReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.SET_AUTH_STATUS:
      return setAuthStatus(state, action);
    default:
      return state;
  }
};

export default combineReducers({
  toastr: toastrReducer,
  main: mainReducer
});
