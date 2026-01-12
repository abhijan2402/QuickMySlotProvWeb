// slices/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: (() => {
    const stored = localStorage.getItem("user");
    try {
      return stored && stored !== "undefined" ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  })(),
  qptoken: localStorage.getItem("qptoken") || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setQpToken: (state, action) => {
      state.qptoken = action.payload;
      localStorage.setItem("qptoken", action.payload);
    },
    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      state.qptoken = null;
      localStorage.clear();
    },
  },
});

export const { setQpToken, setUser, logout } = authSlice.actions;
export default authSlice.reducer;
