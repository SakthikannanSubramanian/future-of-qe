import { configureStore } from '@reduxjs/toolkit'
import userReducer from './slices/userSlice'
import uiReducer from './slices/uiSlice'
import projectReducer from './slices/projectSlice'
import questionnaireReducer from './slices/questionnaireSlice'
import techstackReducer from './slices/techstackSliceUpdated'
import assessmentResultsReducer from './slices/assessmentResultsSlice'
import dashboardReducer from './slices/dashboardSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    ui: uiReducer,
    project: projectReducer,
    questionnaire: questionnaireReducer,
    techstack: techstackReducer,
    assessmentResults: assessmentResultsReducer,
    dashboard: dashboardReducer,
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
