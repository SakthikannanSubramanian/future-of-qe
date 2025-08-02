import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTheme } from '../../hooks/useTheme'
import { motion, AnimatePresence } from 'framer-motion'

// Import actions and selectors from updated slice
import { 
  loadTechStackData,
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
  openComparePanel,
  closeComparePanel
} from '../../redux/slices/techstackSliceUpdated'

import {
  selectTechStackData,
  selectTechStackLoading,
  selectTechStackError,
  selectCurrentLevel,
  selectSelectedStack,
  selectSelectedCategory,
  selectSelectedTool,
  selectCompareTools,
  selectSearchQuery,
  selectFilters,
  selectDetailView,
  selectComparePanel,
  selectStackStats,
  selectCategoryStats,
  selectCurrentTools
} from '../../redux/slices/techstackSliceUpdated'

// Import level components
import Level1StackSelection from '../../components/Level1StackSelection/Level1StackSelection'
import Level2CategoryNavigation from '../../components/Level2CategoryNavigation/Level2CategoryNavigation'
import Level3ToolSelection from '../../components/Level3ToolSelection/Level3ToolSelection'
import Level4ToolDetail from '../../components/Level4ToolDetail/Level4ToolDetail'

// Import UI components
import FloatingCompareButton from '../../components/FloatingCompareButton/FloatingCompareButton'
import Modal from '../../components/Modal/Modal'
import ComparePanel from '../../components/ComparePanel/ComparePanel'
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner'

const TechStack = () => {
  const dispatch = useDispatch()
  const { theme } = useTheme()

  // Data selectors
  const techStacks = useSelector(selectTechStackData)
  const loading = useSelector(selectTechStackLoading)
  const error = useSelector(selectTechStackError)

  // Navigation selectors
  const currentLevel = useSelector(selectCurrentLevel)
  const selectedStack = useSelector(selectSelectedStack)
  const selectedCategory = useSelector(selectSelectedCategory)
  const selectedTool = useSelector(selectSelectedTool)
  
  // Computed
  const currentTools = useSelector(selectCurrentTools)

  // UI state selectors
  const compareTools = useSelector(selectCompareTools)
  const searchQuery = useSelector(selectSearchQuery)
  const filters = useSelector(selectFilters)
  const detailView = useSelector(selectDetailView)
  const comparePanel = useSelector(selectComparePanel)


  // Additional selectors for stack and category stats
  const stackStats = useSelector(selectStackStats)
  const categoryStats = useSelector(selectCategoryStats)

  // Debug logging
  console.log('Current level:', currentLevel);
  console.log('Selected stack:', selectedStack);
  console.log('Category stats:', categoryStats);

  // Merge stack stats into techStacks
  const stacksWithStats = techStacks.map(stack => ({
    ...stack,
    ...(stackStats?.[stack.id] || {})
  }))

  // Merge category stats into categories of selected stack
  const categoriesWithStats = ((selectedStack?.categories || selectedStack?.children || []).map(category => ({
    ...category,
    ...(categoryStats?.[category.id] || {})
  })))

  console.log('Categories with stats:', categoriesWithStats);

  // Load data on component mount
  useEffect(() => {
    if (techStacks.length === 0) {
      dispatch(loadTechStackData())
    }
  }, [dispatch, techStacks.length])

  // Handle navigation actions
  const handleSelectStack = (stack) => {
    console.log('Selected stack:', stack);
    if (!stack) {
      console.error('No stack selected');
      return;
    }
    
    // Check for either categories or children array
    if ((!stack.categories || !Array.isArray(stack.categories)) && (!stack.children || !Array.isArray(stack.children))) {
      console.error('Selected stack has no categories or children array:', stack);
      return;
    }
    
    dispatch(selectStack(stack))
  }

  const handleSelectCategory = (category) => {
    dispatch(selectCategory(category))
  }

  const handleSelectTool = (tool) => {
    dispatch(selectTool(tool))
    dispatch(openDetailView({ tool }))
  }

  const handleBackToStacks = () => {
    dispatch(navigateToLevel(1))
  }

  const handleBackToCategories = () => {
    dispatch(navigateToLevel(2))
  }

  const handleBackToTools = () => {
    dispatch(navigateToLevel(3))
    dispatch(closeDetailView())
  }

  // Handle compare functionality
  const handleToggleCompare = (tool) => {
    dispatch(toggleCompare(tool))
  }

  const handleRemoveFromCompare = (tool) => {
    dispatch(removeFromCompare(tool))
  }

  const handleClearCompare = () => {
    dispatch(clearCompare())
  }

  const handleOpenComparePanel = () => {
    dispatch(openComparePanel())
  }

  const handleCloseComparePanel = () => {
    dispatch(closeComparePanel())
  }

  // Handle search and filters
  const handleSearchChange = (query) => {
    dispatch(setSearchQuery(query))
  }

  const handleFilterChange = (key, value) => {
    dispatch(setFilter({ key, value }))
  }

  const handleClearFilters = () => {
    dispatch(clearFilters())
  }

  // Handle detail view
  const handleCloseDetailView = () => {
    dispatch(closeDetailView())
  }

  // Handle tool actions
  const handleBookmark = (tool) => {
    // Implement bookmark functionality
    console.log('Bookmark tool:', tool.label)
  }

  const handleShare = (tool) => {
    // Implement share functionality
    if (navigator.share) {
      navigator.share({
        title: `${tool.label} - QE Tech Stack Finder`,
        text: tool['What is it?'],
        url: window.location.href
      })
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href)
    }
  }

  const handlePrint = (tool) => {
    // Implement print functionality
    window.print()
  }

  // Page transition variants
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 }
  }

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.5
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => dispatch(loadTechStackData())}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`techStack ${theme}`}>
      {/* Main Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentLevel}
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
          className="pt-20"
        >
          {/* Level 1: Tech Stack Selection */}
          {currentLevel === 1 && (
            <Level1StackSelection
              stacks={stacksWithStats}
              selectedStack={selectedStack}
              onSelectStack={handleSelectStack}
            />
          )}

          {/* Level 2: Category Navigation */}
          {currentLevel === 2 && selectedStack && categoriesWithStats.length > 0 ? (
            <Level2CategoryNavigation
              categories={categoriesWithStats}
              selectedStack={selectedStack}
              selectedCategory={selectedCategory}
              onSelectCategory={handleSelectCategory}
              onBack={handleBackToStacks}
            />
          ) : currentLevel === 2 ? (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">No Categories Found</h2>
                <p className="text-gray-600 mb-4">The selected stack has no categories.</p>
                <button
                  onClick={handleBackToStacks}
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  Back to Stacks
                </button>
              </div>
            </div>
          ) : null}

          {/* Level 3: Tool Selection */}
          {currentLevel === 3 && (
            <Level3ToolSelection
              tools={currentTools}
              selectedStack={selectedStack}
              selectedCategory={selectedCategory}
              selectedTool={selectedTool}
              compareTools={compareTools}
              searchQuery={searchQuery}
              filters={filters}
              onSelectTool={handleSelectTool}
              onToggleCompare={handleToggleCompare}
              onBack={handleBackToCategories}
              onSearchChange={handleSearchChange}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
            />
          )}

          {/* Level 4: Tool Detail */}
          {currentLevel === 4 && selectedTool && (
            <Level4ToolDetail
              tool={selectedTool}
              selectedCategory={selectedCategory}
              isComparing={compareTools.some(t => t.id === selectedTool.id)}
              onToggleCompare={handleToggleCompare}
              onBack={handleBackToTools}
              onBookmark={handleBookmark}
              onShare={handleShare}
              onPrint={handlePrint}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Floating Compare Button */}
      <FloatingCompareButton
        compareCount={compareTools.length}
        onClick={handleOpenComparePanel}
      />

      {/* Compare Panel Modal */}
      <Modal
        isOpen={comparePanel.isOpen}
        onClose={handleCloseComparePanel}
        className="max-w-6xl w-full"
      >
        <ComparePanel
          tools={compareTools}
          onRemoveTool={handleRemoveFromCompare}
          onClearAll={handleClearCompare}
          onClose={handleCloseComparePanel}
        />
      </Modal>

      {/* Tool Detail Modal (for mobile/tablet) */}
      <Modal
        isOpen={detailView.isOpen && currentLevel !== 4}
        onClose={handleCloseDetailView}
        className="max-w-4xl w-full"
      >
        {selectedTool && (
          <Level4ToolDetail
            tool={selectedTool}
            selectedCategory={selectedCategory}
            isComparing={compareTools.some(t => t.id === selectedTool.id)}
            onToggleCompare={handleToggleCompare}
            onBack={handleCloseDetailView}
            onBookmark={handleBookmark}
            onShare={handleShare}
            onPrint={handlePrint}
          />
        )}
      </Modal>
    </div>
  )
}

export default TechStack
