import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: localStorage.getItem("qptoken") || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, qptoken } = action.payload;
      state.user = user;
      state.qptoken = qptoken;
      localStorage.setItem("qptoken", qptoken);
    },
    logout: (state) => {
      state.user = null;
      state.qptoken = null;
      localStorage.removeItem("qptoken");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
