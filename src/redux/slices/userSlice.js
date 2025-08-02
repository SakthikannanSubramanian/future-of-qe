import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// Async thunk for user login
export const loginUser = createAsyncThunk(
  'user/login',
  async ({ email, password }) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    if (email === 'user@example.com' && password === 'password') {
      return { id: 1, email, name: 'John Doe' }
    }
    throw new Error('Invalid credentials')
  }
)

const initialState = {
  currentUser: null,
  isAuthenticated: false,
  loading: false,
  error: null,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state.currentUser = null
      state.isAuthenticated = false
      state.error = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.currentUser = action.payload
        state.isAuthenticated = true
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  },
})

export const { logout, clearError } = userSlice.actions

// Selectors
export const selectCurrentUser = (state) => state.user.currentUser
export const selectIsAuthenticated = (state) => state.user.isAuthenticated
export const selectUserLoading = (state) => state.user.loading
export const selectUserError = (state) => state.user.error

export default userSlice.reducer
