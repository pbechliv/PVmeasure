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

export const setNotes = notes => ({
  type: types.SET_NOTES,
  notes
});

export const addNote = note => ({
  type: types.ADD_NOTE,
  note
});

export const removeNote = note => ({
  type: types.REMOVE_NOTE,
  note
});

export const setCurrentNote = note => ({
  type: types.SET_CURRENT_NOTE,
  note
});
