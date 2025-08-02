import { createSlice } from '@reduxjs/toolkit'

// Helper functions for localStorage
const getThemeFromStorage = () => {
  try {
    const savedTheme = localStorage.getItem('theme')
    return savedTheme && (savedTheme === 'light' || savedTheme === 'dark') ? savedTheme : 'light'
  } catch (error) {
    console.warn('Failed to load theme from localStorage:', error)
    return 'light'
  }
}

const saveThemeToStorage = (theme) => {
  try {
    localStorage.setItem('theme', theme)
  } catch (error) {
    console.warn('Failed to save theme to localStorage:', error)
  }
}

const initialState = {
  theme: getThemeFromStorage(),
  sidebarOpen: false,
  notifications: [],
  loading: false,
}

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light'
      state.theme = newTheme
      saveThemeToStorage(newTheme)
    },
    setTheme: (state, action) => {
      state.theme = action.payload
      saveThemeToStorage(action.payload)
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload
    },
    addNotification: (state, action) => {
      state.notifications.push({
        id: Date.now(),
        ...action.payload,
      })
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      )
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
  },
})

export const {
  toggleTheme,
  setTheme,
  toggleSidebar,
  setSidebarOpen,
  addNotification,
  removeNotification,
  setLoading,
} = uiSlice.actions

// Selectors
export const selectTheme = (state) => state.ui.theme
export const selectSidebarOpen = (state) => state.ui.sidebarOpen
export const selectNotifications = (state) => state.ui.notifications
export const selectLoading = (state) => state.ui.loading

export default uiSlice.reducer
