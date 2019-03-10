import { combineReducers } from "redux";
import { reducer as toastrReducer } from "react-redux-toastr";
import * as types from "./types";

const INITIAL_STATE = {
  isAuthenticated: false,
  userId: null,
  groups: { count: 0, next: null, previous: null, results: [] }
};

const setAuthStatus = (state, action) => ({
  ...state,
  isAuthenticated: action.status,
  userId: action.userId
});

const setGroups = (state, action) => ({
  ...state,
  groups: action.groups
});

const addGroup = (state, action) => ({
  ...state,
  groups: {
    ...state.groups,
    count: state.groups.count++,
    results: [action.group, ...state.groups.results]
  }
});

const mainReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.SET_AUTH_STATUS:
      return setAuthStatus(state, action);
    case types.SET_GROUPS:
      return setGroups(state, action);
    case types.ADD_GROUP:
      return addGroup(state, action);
    default:
      return state;
  }
};

export default combineReducers({
  toastr: toastrReducer,
  main: mainReducer
});
