// store/index.js
import { configureStore } from '@reduxjs/toolkit';
// import authReducer from './slices/authSlice';
import loginModal from './LoginModal'
export const store = configureStore({
  reducer: {
     loginModal : loginModal
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

