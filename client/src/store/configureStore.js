import { configureStore } from '@reduxjs/toolkit'
import authSlice from '../features/auth/authSlice'
import uiSlice from '../features/ui/uiSlice'
import dataSlice from '../features/data/dataSlice'

export const store = configureStore({
  reducer: {
    auth: authSlice,
    ui: uiSlice,
    data: dataSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
})

export default store
