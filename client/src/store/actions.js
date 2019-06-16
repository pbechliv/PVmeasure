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

export const setRecordings = recordings => ({
  type: types.SET_RECORDINGS,
  recordings
});

export const addRecording = recording => ({
  type: types.ADD_RECORDING,
  recording
});

export const removeRecording = recording => ({
  type: types.REMOVE_RECORDING,
  recording
});

export const setCurrentRecording = recording => ({
  type: types.SET_CURRENT_RECORDING,
  recording
});

export const setPlants = plants => ({
  type: types.SET_PLANTS,
  plants
});

export const addPlant = plant => ({
  type: types.ADD_PLANT,
  plant
});

export const removePlant = plant => ({
  type: types.REMOVE_PLANT,
  plant
});

export const setCurrentPlant = plant => ({
  type: types.SET_CURRENT_PLANT,
  plant
});

export const setCurrentFailurePlant = plant => ({
  type: types.SET_CURRENT_FAILURES_PLANT,
  plant
});

export const setFailures = failures => ({
  type: types.SET_FAILURES,
  failures
});

export const addFailure = failure => ({
  type: types.ADD_FAILURE,
  failure
});

export const removeFailure = failure => ({
  type: types.REMOVE_FAILURE,
  failure
});

export const setCurrentFailure = failure => ({
  type: types.SET_CURRENT_FAILURE,
  failure
});
