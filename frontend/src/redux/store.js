import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import driveSlice from "./driveSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    drive: driveSlice
  },
});
