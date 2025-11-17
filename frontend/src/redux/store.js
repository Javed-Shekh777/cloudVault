// import { configureStore } from '@reduxjs/toolkit';
// import { driveApi } from './api';

// export const store = configureStore({
//   reducer: {
//     [driveApi.reducerPath]: driveApi.reducer,

//   },
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware().concat(driveApi.middleware),
// });


// redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import { driveApi } from './api';

import authReducer from "./authSlice";   // your auth slice

export const store = configureStore({
  reducer: {
    [driveApi.reducerPath]: driveApi.reducer,
    auth: authReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(driveApi.middleware),
});
