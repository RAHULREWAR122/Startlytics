import { configureStore } from '@reduxjs/toolkit';

import loginModal from './LoginModal'
import userLocalSlice from './AuthSlice'
export const store = configureStore({
  reducer: {
     loginModal : loginModal,
     userLocalSlice : userLocalSlice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

