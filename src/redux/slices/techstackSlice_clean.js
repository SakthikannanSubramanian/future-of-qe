import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// Async thunk for loading tech stack data
export const loadTechStackData = createAsyncThunk(
  'techstack/loadTechStackData',
  async () => {
    // Simulate API call with loading delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    try {
      // Import the data dynamically
      const techstackData = await import('../../data/techstack-sample.json')
      return techstackData.default || techstackData
    } catch (error) {
      console.error('Failed to load tech stack data:', error)
      throw new Error('Failed to load tech stack data')
    }
  }
)

// Helper function to count total tools in a tech stack
const countToolsInStack = (stack) => {
  let count = 0
  const countRecursive = (items) => {
    items.forEach(item => {
      if (item.children && item.children.length > 0) {
        countRecursive(item.children)
      } else if (item.label && item.icon) {
        // This is a tool (has icon and label but no children)
        count++
      }
    })
  }
  if (stack.children) {
    countRecursive(stack.children)
  }
  return count
}

// Initial state
const initialState = {
  data: [],
  navigationHistory: [],
  compareList: [],
  loading: false,
  error: null
}

// Tech stack slice
const techstackSlice = createSlice({
  name: 'techstack',
  initialState,
  reducers: {
    // Navigate to a category or tool
    navigateToCategory: (state, action) => {
      const item = action.payload
      state.navigationHistory.push(item)
    },

    // Navigate to a specific tool
    navigateToTool: (state, action) => {
      const tool = action.payload
      state.navigationHistory.push(tool)
    },

    // Navigate back one level
    navigateBack: (state) => {
      state.navigationHistory.pop()
    },

    // Reset navigation to root
    resetNavigation: (state) => {
      state.navigationHistory = []
    },

    // Toggle item in compare list
    toggleCompare: (state, action) => {
      const item = action.payload
      const existingIndex = state.compareList.findIndex(compareItem => compareItem.id === item.id)
      
      if (existingIndex >= 0) {
        // Remove from compare list
        state.compareList.splice(existingIndex, 1)
      } else {
        // Add to compare list (max 4 items)
        if (state.compareList.length < 4) {
          state.compareList.push(item)
        }
      }
    },

    // Clear all items from compare list
    clearCompare: (state) => {
      state.compareList = []
    },

    // Set error
    setError: (state, action) => {
      state.error = action.payload
    },

    // Clear error
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadTechStackData.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loadTechStackData.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
        state.error = null
      })
      .addCase(loadTechStackData.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to load tech stack data'
      })
  }
})

// Export actions
export const {
  navigateToCategory,
  navigateToTool,
  navigateBack,
  resetNavigation,
  toggleCompare,
  clearCompare,
  setError,
  clearError
} = techstackSlice.actions

// Selectors
export const selectTechStackData = (state) => state.techstack.data
export const selectNavigationHistory = (state) => state.techstack.navigationHistory
export const selectCompareList = (state) => state.techstack.compareList
export const selectIsLoading = (state) => state.techstack.loading
export const selectError = (state) => state.techstack.error

// Selector for current data based on navigation history
export const selectCurrentData = (state) => {
  const { data, navigationHistory } = state.techstack
  
  if (navigationHistory.length === 0) {
    // Root level - return main categories
    return data
  }
  
  // Navigate to the current level
  let currentLevel = data
  for (const navItem of navigationHistory) {
    const foundItem = currentLevel.find(item => item.id === navItem.id)
    if (foundItem && foundItem.children) {
      currentLevel = foundItem.children
    } else {
      return []
    }
  }
  
  return currentLevel || []
}

// Selector for current navigation context
export const selectCurrentContext = (state) => {
  const navigationHistory = selectNavigationHistory(state)
  if (navigationHistory.length === 0) {
    return { level: 'root', item: null }
  }
  
  const currentItem = navigationHistory[navigationHistory.length - 1]
  return {
    level: navigationHistory.length === 1 ? 'category' : 'subcategory',
    item: currentItem
  }
}

// Selector for current tools count
export const selectCurrentToolsCount = (state) => {
  const currentData = selectCurrentData(state)
  return countToolsInStack({ children: currentData })
}

// Selector to check if an item is in compare list
export const selectIsInCompareList = (state, itemId) => {
  return state.techstack.compareList.some(item => item.id === itemId)
}

export default techstackSlice.reducer
