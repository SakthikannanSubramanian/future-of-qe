import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// Async thunk for saving project details
export const saveProjectDetails = createAsyncThunk(
  'project/saveProjectDetails',
  async (projectData) => {
    const url = 'https://projectmanagement-e2e5.onrender.com/api/v1/project-details';
    const postBody = JSON.stringify(projectData);
    let success = false;
    let response;
    // Try POST once, retry once if fails
    for (let attempt = 0; attempt < 2 && !success; attempt++) {
      try {
        response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: postBody,
        });
        if (response.ok) {
          success = true;
          break;
        } else {
          throw new Error('Backend returned error');
        }
      } catch (err) {
        if (attempt === 1) {
          console.warn('Failed to save project details to backend after retry:', err.message);
        }
      }
    }
    if (!success) {
      // Fallback: save to localStorage for persistence
      localStorage.setItem('projectDetails', postBody);
    }
    return projectData;
  }
)

// Async thunk for loading project details
export const loadProjectDetails = createAsyncThunk(
  'project/loadProjectDetails',
  async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Load from localStorage
    const saved = localStorage.getItem('projectDetails')
    return saved ? JSON.parse(saved) : null
  }
)

const initialState = {
  projectDetails: null,
  loading: false,
  error: null,
  saveStatus: 'idle', // 'idle' | 'pending' | 'succeeded' | 'failed'
}

export const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    clearProjectDetails: (state) => {
      state.projectDetails = null
      state.error = null
      state.saveStatus = 'idle'
      localStorage.removeItem('projectDetails')
    },
    clearError: (state) => {
      state.error = null
    },
    updateProjectDetails: (state, action) => {
      state.projectDetails = { ...state.projectDetails, ...action.payload }
    },
  },
  extraReducers: (builder) => {
    builder
      // Save project details
      .addCase(saveProjectDetails.pending, (state) => {
        state.loading = true
        state.error = null
        state.saveStatus = 'pending'
      })
      .addCase(saveProjectDetails.fulfilled, (state, action) => {
        state.loading = false
        state.projectDetails = action.payload
        state.saveStatus = 'succeeded'
      })
      .addCase(saveProjectDetails.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to save project details'
        state.saveStatus = 'failed'
      })
      // Load project details
      .addCase(loadProjectDetails.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loadProjectDetails.fulfilled, (state, action) => {
        state.loading = false
        state.projectDetails = action.payload
      })
      .addCase(loadProjectDetails.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to load project details'
      })
  },
})

export const { clearProjectDetails, clearError, updateProjectDetails } = projectSlice.actions

// Selectors
export const selectProjectDetails = (state) => state.project.projectDetails
export const selectProjectDetailsLoading = (state) => state.project.loading
export const selectProjectDetailsError = (state) => state.project.error
export const selectProjectSaveStatus = (state) => state.project.saveStatus

export default projectSlice.reducer
