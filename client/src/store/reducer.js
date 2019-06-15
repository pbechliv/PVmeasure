import { combineReducers } from "redux";
import { reducer as toastrReducer } from "react-redux-toastr";
import * as types from "./types";

const defaultServerList = { count: 0, next: null, previous: null, results: [] };

const INITIAL_STATE = {
  isAuthenticated: false,
  userId: null,
  username: "",
  groups: { ...defaultServerList },
  recordings: { ...defaultServerList },
  plants: { ...defaultServerList },
  currentGroup: null,
  currentRecording: null,
  currentPlant: null
};

const setAuthStatus = (state, action) => ({
  ...state,
  isAuthenticated: action.status,
  userId: action.userId,
  username: action.username
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

const removeGroup = (state, action) => {
  const newList = [...state.groups.results];
  const index = newList.findIndex(i => action.group.id === i.id);
  newList.splice(index, 1);
  return {
    ...state,
    groups: {
      ...state.groups,
      count: state.groups.count - 1,
      results: newList
    }
  };
};

const setCurrentGroup = (state, action) => ({
  ...state,
  currentGroup: action.group
});

const setRecordings = (state, action) => ({
  ...state,
  recordings: action.recordings
});

const addRecording = (state, action) => ({
  ...state,
  recordings: {
    ...state.recordings,
    count: state.recordings.count++,
    results: [action.recording, ...state.recordings.results]
  }
});

const removeRecording = (state, action) => {
  const newList = [...state.recordings.results];
  const index = newList.findIndex(i => action.recording.id === i.id);
  newList.splice(index, 1);
  return {
    ...state,
    recordings: {
      ...state.recordings,
      count: state.recordings.count - 1,
      results: newList
    }
  };
};

const setCurrentRecording = (state, action) => ({
  ...state,
  currentRecording: action.recording
});

const setPlants = (state, action) => ({
  ...state,
  plants: action.plants
});

const addPlant = (state, action) => ({
  ...state,
  plants: {
    ...state.plants,
    count: state.plants.count++,
    results: [action.plant, ...state.plants.results]
  }
});

const removePlant = (state, action) => {
  const newList = [...state.plants.results];
  const index = newList.findIndex(i => action.plant.id === i.id);
  newList.splice(index, 1);
  return {
    ...state,
    plants: {
      ...state.plants,
      count: state.plants.count - 1,
      results: newList
    }
  };
};

const setCurrentPlant = (state, action) => ({
  ...state,
  currentPlant: action.plant
});

const mainReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.SET_AUTH_STATUS:
      return setAuthStatus(state, action);
    case types.SET_GROUPS:
      return setGroups(state, action);
    case types.ADD_GROUP:
      return addGroup(state, action);
    case types.REMOVE_GROUP:
      return removeGroup(state, action);
    case types.SET_CURRENT_GROUP:
      return setCurrentGroup(state, action);
    case types.SET_RECORDINGS:
      return setRecordings(state, action);
    case types.ADD_RECORDING:
      return addRecording(state, action);
    case types.REMOVE_RECORDING:
      return removeRecording(state, action);
    case types.SET_CURRENT_RECORDING:
      return setCurrentRecording(state, action);
    case types.SET_PLANTS:
      return setPlants(state, action);
    case types.ADD_PLANT:
      return addPlant(state, action);
    case types.REMOVE_PLANT:
      return removePlant(state, action);
    case types.SET_CURRENT_PLANT:
      return setCurrentPlant(state, action);
    default:
      return state;
  }
};

export default combineReducers({
  toastr: toastrReducer,
  main: mainReducer
});
