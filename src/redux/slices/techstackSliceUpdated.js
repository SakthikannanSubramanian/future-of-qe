import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// Async thunk for loading tech stack data
export const loadTechStackData = createAsyncThunk(
  'techstack/loadTechStackData',
  async () => {
    try {
      // Try fetching from backend API
      const response = await fetch('http://localhost:8083/api/v1/tech-stack');
      if (!response.ok) throw new Error('Backend returned error');
      const data = await response.json();
      // Transform data to ensure categories property for consistency
      const transformedData = data.map(stack => ({
        ...stack,
        categories: stack.children || [],
        children: stack.children || []
      }));
      return transformedData;
    } catch (error) {
      // Fallback to local JSON import
      try {
        const localResponse = await import('../../data/techstack-sample.json');
        const localData = localResponse.default;
        const transformedData = localData.map(stack => ({
          ...stack,
          categories: stack.children || [],
          children: stack.children || []
        }));
        return transformedData;
      } catch (localError) {
        console.error('Failed to load tech stack data from both backend and local:', localError);
        throw localError;
      }
    }
  }
)

const initialState = {
  // Data
  techStacks: [],
  loading: false,
  error: null,
  
  // Navigation state
  currentLevel: 1, // 1: Stack, 2: Category, 3: Tools, 4: Detail
  selectedStack: null,
  selectedCategory: null,
  selectedTool: null,
  
  // UI state
  compareTools: [],
  searchQuery: '',
  filters: {
    complexity: null,
    platform: null,
    popular: false
  },
  
  // Detail view state
  detailView: {
    isOpen: false,
    activeTab: 'overview'
  },
  
  // Compare panel state
  comparePanel: {
    isOpen: false,
    activeSection: 'overview'
  }
}

const techstackSlice = createSlice({
  name: 'techstack',
  initialState,
  reducers: {
    // Navigation actions
    setCurrentLevel: (state, action) => {
      state.currentLevel = action.payload
    },
    
    selectStack: (state, action) => {
      state.selectedStack = action.payload
      state.selectedCategory = null
      state.selectedTool = null
      state.currentLevel = action.payload ? 2 : 1
     
    },
    
    selectCategory: (state, action) => {
      state.selectedCategory = action.payload
      state.selectedTool = null
      state.currentLevel = action.payload ? 3 : 2

    },
    
    selectTool: (state, action) => {
      state.selectedTool = action.payload
      state.currentLevel = action.payload ? 4 : 3
     
    },
    
    navigateToLevel: (state, action) => {
      const level = action.payload
      state.currentLevel = level
      
      if (level === 1) {
        state.selectedStack = null
        state.selectedCategory = null
        state.selectedTool = null
      } else if (level === 2) {
        state.selectedCategory = null
        state.selectedTool = null
      } else if (level === 3) {
        state.selectedTool = null
      }
    },
    
    // Compare functionality
    toggleCompare: (state, action) => {
      const tool = action.payload
      const existingIndex = state.compareTools.findIndex(t => t.id === tool.id)
      
      if (existingIndex >= 0) {
        state.compareTools.splice(existingIndex, 1)
      } else {
        if (state.compareTools.length < 5) { // Limit to 5 tools
          state.compareTools.push(tool)
        }
      }
    },
    
    removeFromCompare: (state, action) => {
      const tool = action.payload
      state.compareTools = state.compareTools.filter(t => t.id !== tool.id)
    },
    
    clearCompare: (state) => {
      state.compareTools = []
    },
    
    // Search and filters
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload
    },
    
    setFilter: (state, action) => {
      const { key, value } = action.payload
      state.filters[key] = value
    },
    
    clearFilters: (state) => {
      state.filters = {
        complexity: null,
        platform: null,
        popular: false
      }
      state.searchQuery = ''
    },
    
    // Detail view
    openDetailView: (state, action) => {
      state.detailView.isOpen = true
      if (action.payload && action.payload.tool) {
        state.selectedTool = action.payload.tool
      }
      if (action.payload && action.payload.tab) {
        state.detailView.activeTab = action.payload.tab
      }
    },
    
    closeDetailView: (state) => {
      state.detailView.isOpen = false
    },
    
    setDetailTab: (state, action) => {
      state.detailView.activeTab = action.payload
    },
    
    // Compare panel
    openComparePanel: (state) => {
      state.comparePanel.isOpen = true
    },
    
    closeComparePanel: (state) => {
      state.comparePanel.isOpen = false
    },
    
    setCompareSection: (state, action) => {
      state.comparePanel.activeSection = action.payload
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
        state.techStacks = action.payload
      })
      .addCase(loadTechStackData.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  },
})

// Action creators
export const {
  setCurrentLevel,
  selectStack,
  selectCategory,
  selectTool,
  navigateToLevel,
  toggleCompare,
  removeFromCompare,
  clearCompare,
  setSearchQuery,
  setFilter,
  clearFilters,
  openDetailView,
  closeDetailView,
  setDetailTab,
  openComparePanel,
  closeComparePanel,
  setCompareSection
} = techstackSlice.actions

// Selectors
export const selectTechStackData = (state) => state.techstack.techStacks
export const selectTechStackLoading = (state) => state.techstack.loading
export const selectTechStackError = (state) => state.techstack.error

export const selectCurrentLevel = (state) => state.techstack.currentLevel
export const selectSelectedStack = (state) => state.techstack.selectedStack
export const selectSelectedCategory = (state) => state.techstack.selectedCategory
export const selectSelectedTool = (state) => state.techstack.selectedTool

export const selectCompareTools = (state) => state.techstack.compareTools
export const selectSearchQuery = (state) => state.techstack.searchQuery
export const selectFilters = (state) => state.techstack.filters

export const selectDetailView = (state) => state.techstack.detailView
export const selectComparePanel = (state) => state.techstack.comparePanel

// Computed selectors
export const selectCurrentCategories = (state) => {
  const selectedStack = state.techstack.selectedStack
  return selectedStack ? (selectedStack.categories || selectedStack.children || []) : []
}

export const selectCurrentTools = (state) => {
  const category = state.techstack.selectedCategory
  if (!category) return []
  
  const tools = category.children || []
  const { searchQuery, filters } = state.techstack
  
  // Filter tools based on search and filters
  let filteredTools = tools
  
  if (searchQuery) {
    filteredTools = filteredTools.filter(tool =>
      tool.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool['What is it?']?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }
  
  if (filters.complexity) {
    filteredTools = filteredTools.filter(tool => tool.complexity === filters.complexity)
  }
  
  if (filters.platform) {
    filteredTools = filteredTools.filter(tool => tool.platforms?.includes(filters.platform))
  }
  
  if (filters.popular) {
    filteredTools = filteredTools.filter(tool => tool.popular === true)
  }
  
  return filteredTools
}

export const selectStackStats = (state) => {
  return state.techstack.techStacks.map(stack => {
    const categories = stack.categories || stack.children || []
    return {
      ...stack,
      categoryCount: categories.length,
      toolCount: categories.reduce((total, category) => 
        total + ((category.children || []).length || 0), 0)
    }
  })
}

export const selectCategoryStats = (state) => {
  const categories = selectCurrentCategories(state)
  return categories.map(category => ({
    ...category,
    toolCount: (category.children || []).length || 0
  }))
}

export default techstackSlice.reducer
