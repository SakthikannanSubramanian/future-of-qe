import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { 
  loadTechStackData,
  navigateToCategory,
  navigateToTool,
  navigateBack,
  resetNavigation,
  toggleCompare,
  clearCompare,
  selectCurrentData,
  selectNavigationHistory,
  selectIsLoading,
  selectError,
  selectCompareList
} from '../../redux/slices/techstackSlice_clean'
import CategoryCard from '../../components/CategoryCard/CategoryCard'
import ToolCard from '../../components/ToolCard/ToolCard'
import ToolDetail from '../../components/ToolDetail/ToolDetail'
import ComparePanel from '../../components/ComparePanel/ComparePanel'
import FloatingCompareButton from '../../components/FloatingCompareButton/FloatingCompareButton'
import Modal from '../../components/Modal/Modal'
import BackButton from '../../components/BackButton/BackButton'
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner'

const TechStack = () => {
  const dispatch = useDispatch()
  const currentData = useSelector(selectCurrentData)
  const navigationHistory = useSelector(selectNavigationHistory)
  const isLoading = useSelector(selectIsLoading)
  const error = useSelector(selectError)
  const compareList = useSelector(selectCompareList)
  
  const [selectedTool, setSelectedTool] = useState(null)
  const [showComparePanel, setShowComparePanel] = useState(false)

  // Load data on mount
  useEffect(() => {
    dispatch(loadTechStackData())
  }, [dispatch])

  // Determine current view level
  const currentLevel = navigationHistory.length
  const isRootLevel = currentLevel === 0
  const isCategoryLevel = currentLevel === 1
  const isToolLevel = currentLevel === 2

  // Handle category selection
  const handleCategorySelect = (category) => {
    if (category.children && category.children.length > 0) {
      dispatch(navigateToCategory(category))
    }
  }

  // Handle tool selection
  const handleToolSelect = (tool) => {
    if (tool.children && tool.children.length > 0) {
      dispatch(navigateToCategory(tool))
    } else {
      setSelectedTool(tool)
    }
  }

  // Handle tool detail view
  const handleViewDetails = (tool) => {
    setSelectedTool(tool)
  }

  // Handle compare toggle
  const handleCompareToggle = (tool) => {
    dispatch(toggleCompare(tool))
  }

  // Handle navigation back
  const handleBack = () => {
    dispatch(navigateBack())
  }

  // Handle reset to root
  const handleResetNavigation = () => {
    dispatch(resetNavigation())
    setSelectedTool(null)
    setShowComparePanel(false)
  }

  // Handle compare panel
  const handleShowCompare = () => {
    setShowComparePanel(true)
  }

  const handleCloseCompare = () => {
    setShowComparePanel(false)
  }

  const handleClearAllCompare = () => {
    dispatch(clearCompare())
    setShowComparePanel(false)
  }

  const handleRemoveFromCompare = (tool) => {
    dispatch(toggleCompare(tool))
  }

  // Handle close tool detail
  const handleCloseToolDetail = () => {
    setSelectedTool(null)
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="large" />
          <p className="mt-4 text-gray-600">Loading tech stack data...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => dispatch(loadTechStackData())}
            className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // Get current view title
  const getCurrentTitle = () => {
    if (isRootLevel) return 'Tech Stack Categories'
    if (isCategoryLevel) return navigationHistory[0]?.label || 'Categories'
    if (isToolLevel) return navigationHistory[1]?.label || 'Tools'
    return 'Tech Stack'
  }

  // Check if item has tools (for proper categorization)
  const hasTools = (item) => {
    return item.children && item.children.some(child => !child.children || child.children.length === 0)
  }

  // Render grid items
  const renderGridItem = (item, index) => {
    const isSelected = false // We don't need selection states for navigation
    const isComparing = compareList.some(compareItem => compareItem.id === item.id)

    // If item has children, it's a category
    if (item.children && item.children.length > 0 && !hasTools(item)) {
      return (
        <CategoryCard
          key={item.id}
          category={item}
          isSelected={isSelected}
          onClick={handleCategorySelect}
          className="h-48"
        />
      )
    }

    // Otherwise, it's a tool
    return (
      <ToolCard
        key={item.id}
        tool={item}
        isSelected={isSelected}
        isComparing={isComparing}
        onSelect={handleToolSelect}
        onCompareToggle={handleCompareToggle}
        onViewDetails={handleViewDetails}
        className="h-80"
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {!isRootLevel && (
                <BackButton 
                  onClick={handleBack}
                  label="Back"
                />
              )}
              
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {getCurrentTitle()}
                </h1>
                
                {/* Visual breadcrumb */}
                {!isRootLevel && (
                  <div className="mt-1 flex items-center space-x-2 text-sm text-gray-500">
                    <button
                      onClick={handleResetNavigation}
                      className="hover:text-gray-700 transition-colors"
                    >
                      Tech Stack
                    </button>
                    {navigationHistory.map((item, index) => (
                      <React.Fragment key={item.id}>
                        <span>›</span>
                        <span className={index === navigationHistory.length - 1 ? 'text-gray-900 font-medium' : ''}>
                          {item.label}
                        </span>
                      </React.Fragment>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Compare counter */}
            {compareList.length > 0 && (
              <div className="hidden sm:block">
                <button
                  onClick={handleShowCompare}
                  className="inline-flex items-center space-x-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg hover:bg-indigo-200 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                  <span>Compare ({compareList.length})</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentData && currentData.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentData.map(renderGridItem)}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📂</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Items Found</h3>
            <p className="text-gray-600">
              {isRootLevel 
                ? 'No categories available at the moment.' 
                : 'This category doesn\'t contain any items.'
              }
            </p>
          </div>
        )}
      </div>

      {/* Floating Compare Button */}
      <FloatingCompareButton
        compareCount={compareList.length}
        onClick={handleShowCompare}
      />

      {/* Tool Detail Modal */}
      <Modal
        isOpen={!!selectedTool}
        onClose={handleCloseToolDetail}
        className="max-w-4xl w-full"
      >
        {selectedTool && (
          <ToolDetail
            tool={selectedTool}
            onClose={handleCloseToolDetail}
            onCompareToggle={handleCompareToggle}
            isComparing={compareList.some(item => item.id === selectedTool.id)}
          />
        )}
      </Modal>

      {/* Compare Panel Modal */}
      <Modal
        isOpen={showComparePanel}
        onClose={handleCloseCompare}
        className="max-w-6xl w-full"
      >
        <ComparePanel
          tools={compareList}
          onRemoveTool={handleRemoveFromCompare}
          onClearAll={handleClearAllCompare}
          onClose={handleCloseCompare}
        />
      </Modal>
    </div>
  )
}

export default TechStack
