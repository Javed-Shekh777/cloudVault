// redux/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token = null } = action.payload;
      state.user = user;
      state.token = token;
      if (token) {
        localStorage.setItem("token", token);

      }
      localStorage.setItem("user", JSON.stringify(user));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }

  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
