import { configureStore } from '@reduxjs/toolkit';
import { driveApi } from './api';

export const store = configureStore({
  reducer: {
    [driveApi.reducerPath]: driveApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(driveApi.middleware),
});
