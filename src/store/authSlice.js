import { createSlice } from "@reduxjs/toolkit";

const initValue = { auth: false, userData: null };

const authSlice = createSlice({
  name: "authSlice",
  initialState: initValue,
  reducers: {
    authUpdate(state, action) {
      state.auth = action.payload;
    },
    userDataUpdate(state, action) {
      state.userData = action.payload;
    },
  },
});

export const authSliceActions = authSlice.actions;

export default authSlice.reducer;
