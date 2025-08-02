import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './slices/counterSlice'
import userReducer from './slices/userSlice'
import uiReducer from './slices/uiSlice'
import projectReducer from './slices/projectSlice'
import questionnaireReducer from './slices/questionnaireSlice'
import techstackReducer from './slices/techstackSliceUpdated'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    user: userReducer,
    ui: uiReducer,
    project: projectReducer,
    questionnaire: questionnaireReducer,
    techstack: techstackReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
})

export const useAppDispatch = () => store.dispatch
export const useAppSelector = (selector) => selector(store.getState())
