import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import driveSlice from "./driveSlice";
import lockedSlice from "./lockedSlice";


export const store = configureStore({
  reducer: {
    auth: authReducer,
    drive: driveSlice,
    locked: lockedSlice,
  },
});
