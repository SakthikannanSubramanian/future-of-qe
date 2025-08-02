import { describe, it, expect, beforeEach, vi } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import projectReducer, {
  saveProjectDetails,
  loadProjectDetails,
  clearProjectDetails,
  clearError,
  updateProjectDetails,
} from '../redux/slices/projectSlice'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
global.localStorage = localStorageMock

describe('projectSlice', () => {
  let store

  beforeEach(() => {
    store = configureStore({
      reducer: {
        project: projectReducer,
      },
    })
    vi.clearAllMocks()
  })

  const mockProjectData = {
    projectName: 'Test Project',
    accountName: 'Test Account',
    emailId: 'test@example.com',
    managerSelect: 'john-smith',
    edlSelect: 'engineering-lead-1',
    pdl: 'Test PDL'
  }

  describe('initial state', () => {
    it('should return the initial state', () => {
      const state = store.getState().project
      expect(state).toEqual({
        projectDetails: null,
        loading: false,
        error: null,
        saveStatus: 'idle',
      })
    })
  })

  describe('synchronous actions', () => {
    it('should handle clearProjectDetails', () => {
      // First set some data
      store.dispatch(updateProjectDetails(mockProjectData))
      
      // Then clear it
      store.dispatch(clearProjectDetails())
      
      const state = store.getState().project
      expect(state.projectDetails).toBeNull()
      expect(state.error).toBeNull()
      expect(state.saveStatus).toBe('idle')
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('projectDetails')
    })

    it('should handle clearError', () => {
      // Set initial state with error
      const initialState = {
        projectDetails: null,
        loading: false,
        error: 'Some error',
        saveStatus: 'failed',
      }
      
      const action = clearError()
      const state = projectReducer(initialState, action)
      
      expect(state.error).toBeNull()
    })

    it('should handle updateProjectDetails', () => {
      const partialUpdate = { projectName: 'Updated Project' }
      
      store.dispatch(updateProjectDetails(partialUpdate))
      
      const state = store.getState().project
      expect(state.projectDetails).toEqual(partialUpdate)
    })

    it('should merge updateProjectDetails with existing data', () => {
      // Set initial data
      store.dispatch(updateProjectDetails(mockProjectData))
      
      // Update with partial data
      const partialUpdate = { projectName: 'Updated Project Name' }
      store.dispatch(updateProjectDetails(partialUpdate))
      
      const state = store.getState().project
      expect(state.projectDetails).toEqual({
        ...mockProjectData,
        projectName: 'Updated Project Name'
      })
    })
  })

  describe('saveProjectDetails async thunk', () => {
    it('should handle saveProjectDetails.pending', () => {
      const action = { type: saveProjectDetails.pending.type }
      const state = projectReducer(undefined, action)
      
      expect(state.loading).toBe(true)
      expect(state.error).toBeNull()
      expect(state.saveStatus).toBe('pending')
    })

    it('should handle saveProjectDetails.fulfilled', () => {
      const action = {
        type: saveProjectDetails.fulfilled.type,
        payload: mockProjectData
      }
      const state = projectReducer(undefined, action)
      
      expect(state.loading).toBe(false)
      expect(state.projectDetails).toEqual(mockProjectData)
      expect(state.saveStatus).toBe('succeeded')
    })

    it('should handle saveProjectDetails.rejected', () => {
      const action = {
        type: saveProjectDetails.rejected.type,
        error: { message: 'Save failed' }
      }
      const state = projectReducer(undefined, action)
      
      expect(state.loading).toBe(false)
      expect(state.error).toBe('Save failed')
      expect(state.saveStatus).toBe('failed')
    })

    it('should save to localStorage and return data', async () => {
      const result = await store.dispatch(saveProjectDetails(mockProjectData))
      
      expect(result.type).toBe('project/saveProjectDetails/fulfilled')
      expect(result.payload).toEqual(mockProjectData)
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'projectDetails',
        JSON.stringify(mockProjectData)
      )
    })
  })

  describe('loadProjectDetails async thunk', () => {
    it('should handle loadProjectDetails.pending', () => {
      const action = { type: loadProjectDetails.pending.type }
      const state = projectReducer(undefined, action)
      
      expect(state.loading).toBe(true)
      expect(state.error).toBeNull()
    })

    it('should handle loadProjectDetails.fulfilled with data', () => {
      const action = {
        type: loadProjectDetails.fulfilled.type,
        payload: mockProjectData
      }
      const state = projectReducer(undefined, action)
      
      expect(state.loading).toBe(false)
      expect(state.projectDetails).toEqual(mockProjectData)
    })

    it('should handle loadProjectDetails.fulfilled with null data', () => {
      const action = {
        type: loadProjectDetails.fulfilled.type,
        payload: null
      }
      const state = projectReducer(undefined, action)
      
      expect(state.loading).toBe(false)
      expect(state.projectDetails).toBeNull()
    })

    it('should handle loadProjectDetails.rejected', () => {
      const action = {
        type: loadProjectDetails.rejected.type,
        error: { message: 'Load failed' }
      }
      const state = projectReducer(undefined, action)
      
      expect(state.loading).toBe(false)
      expect(state.error).toBe('Load failed')
    })

    it('should load from localStorage when data exists', async () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockProjectData))
      
      const result = await store.dispatch(loadProjectDetails())
      
      expect(result.type).toBe('project/loadProjectDetails/fulfilled')
      expect(result.payload).toEqual(mockProjectData)
      expect(localStorageMock.getItem).toHaveBeenCalledWith('projectDetails')
    })

    it('should return null when no data in localStorage', async () => {
      localStorageMock.getItem.mockReturnValue(null)
      
      const result = await store.dispatch(loadProjectDetails())
      
      expect(result.type).toBe('project/loadProjectDetails/fulfilled')
      expect(result.payload).toBeNull()
    })
  })

  describe('selectors', () => {
    it('should select project details', () => {
      const state = {
        project: {
          projectDetails: mockProjectData,
          loading: false,
          error: null,
          saveStatus: 'succeeded'
        }
      }
      
      // Import selectors
      const { 
        selectProjectDetails,
        selectProjectDetailsLoading,
        selectProjectDetailsError,
        selectProjectSaveStatus
      } = require('../redux/slices/projectSlice')
      
      expect(selectProjectDetails(state)).toEqual(mockProjectData)
      expect(selectProjectDetailsLoading(state)).toBe(false)
      expect(selectProjectDetailsError(state)).toBeNull()
      expect(selectProjectSaveStatus(state)).toBe('succeeded')
    })
  })
})
