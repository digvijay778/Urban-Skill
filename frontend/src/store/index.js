import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@features/auth/authSlice';
import workerReducer from '@features/worker/workerSlice';
import bookingReducer from '@features/booking/bookingSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    worker: workerReducer,
    booking: bookingReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['your/action/type'],
      },
    }),
});
