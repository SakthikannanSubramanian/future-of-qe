import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PropTypes from 'prop-types'
import BackButton from '../BackButton/BackButton'

const Level3ToolSelection = ({ 
  tools = [],
  selectedStack,
  selectedCategory,
  selectedTool,
  compareTools = [],
  searchQuery = '',
  filters = {},
  onSelectTool,
  onToggleCompare,
  onBack,
  onSearchChange,
  onFilterChange,
  onClearFilters,
  className = '',
  ...props 
}) => {
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'

  // Comprehensive icon mapping for different tools
  const getToolIcon = (tool) => {
    const iconMap = {
      // Frontend Testing Tools
      'typescript': '📘',
      'eslint': '🔍',
      'storybook': '📚',
      'react-testing-library': '🧪',
      'jest': '🃏',
      'cypress': '🌲',
      'playwright': '🎭',
      'pact': '🤝',
      
      // Backend Testing Tools
      'jacoco': '📊',
      'sonarqube': '🔎',
      'junit': '☕',
      'pitest': '🎯',
      'mockito': '🎭',
      'karate': '🥋',
      'rest-assured': '🔌',
      'spring-cloud-data-flow': '🌊',
      'testcontainers': '🐳',
      'test-rest-template': '🔧',
      'unirest': '🌐',
      'wiremock': '🎪',
      'charles': '🔍',
      'gatling': '⚡',
      'k6': '📈',
      'jmeter': '🔨',
      'postman': '📮',
      'httpio': '🌐',
      'owasp-dependency-check': '🛡️',
      'snyk': '🔒',
      'victoria-metrics': '📊',
      'grafana': '📊',
      'prometheus': '🔥',
      'mockserver': '🎪',
      'dbfit': '🗄️',
      
      // Mobile Testing Tools
      'appium': '📱',
      
      // DevOps Testing Tools
      'jenkins': '🏗️',
      
      // Performance Testing
      'sitespeed': '🚀',
      'lighthouse-ci': '🏮',
      
      // Security Testing
      'zap': '⚡',
      'burpsuite': '🔒',
      
      // Accessibility Testing
      'axe': '♿',
      'accessibility-insights': '👁️',
      'wave': '🌊',
      
      // Compatibility Testing
      'browserstack': '🌐',
      
      // Visual Testing
      'percy': '👁️',
      
      // Observability
      'sentry': '🚨',
      
      // A/B Testing
      'growthbook': '📈',
      'optimizely': '🎯',
      
      // Functional Testing
      'codeceptjs': '🤖',
      'protractor': '🔺',
      'puppeteer': '🎭',
      'webdriverio': '🌐',
      
      // General Tools
      'express': '🚂',
      'cucumber': '🥒',
      'web-developer-tools': '🛠️',
    }
    
    // Try to match by id first, then by label (lowercase), then fall back to provided icon or default
    const toolId = tool.id?.toLowerCase()
    const toolLabel = tool.label?.toLowerCase().replace(/\s+/g, '-')
    
    return iconMap[toolId] || 
           iconMap[toolLabel] || 
           tool.icon || 
           getDefaultIconByCategory(selectedCategory?.label) ||
           '🔧'
  }

  // Default icons based on category type
  const getDefaultIconByCategory = (categoryLabel) => {
    const categoryIcons = {
      'static testing': '🔍',
      'unit testing': '🧪',
      'contract testing': '🤝',
      'functional testing': '⚙️',
      'integration testing': '🔗',
      'visual regression testing': '👁️',
      'security testing': '🛡️',
      'accessibility testing': '♿',
      'compatibility testing': '🌐',
      'performance': '🚀',
      'exploratory': '🔍',
      'observability': '📊',
      'a/b testing': '📈',
      'api testing': '🔌',
      'native testing': '📱',
      'ci/cd': '🔄',
      'performance testing': '⚡',
      'exploratory testing': '🔍',
      'security testing': '🔒',
      'observability testing': '📊',
      'service virtualisation testing': '🎪',
      'data migration testing': '🗄️'
    }
    
    return categoryIcons[categoryLabel?.toLowerCase()] || '🔧'
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  }

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    hover: { 
      scale: 1.02,
      y: -3,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    },
    tap: { 
      scale: 0.98 
    }
  }

  const getComplexityInfo = (complexity) => {
    const complexityMap = {
      1: { label: 'Beginner', color: 'bg-green-100 text-green-800', icon: '🟢' },
      2: { label: 'Intermediate', color: 'bg-yellow-100 text-yellow-800', icon: '🟡' },
      3: { label: 'Advanced', color: 'bg-red-100 text-red-800', icon: '🔴' }
    }
    return complexityMap[complexity] || { label: 'Unknown', color: 'bg-gray-100 text-gray-800', icon: '⚪' }
  }

  const handleToolSelect = (tool) => {
    onSelectTool?.(tool)
  }

  const handleSearchChange = (query) => {
    onSearchChange?.(query)
  }

  const handleFilterChange = (key, value) => {
    onFilterChange?.(key, value)
  }

  const handleClearFilters = () => {
    onClearFilters?.()
    onSearchChange?.('')
  }

  const isComparing = (tool) => {
    return compareTools.some(t => t.id === tool.id)
  }

  if (!selectedCategory || tools.length === 0) {
    return null
  }

  return (
    <div 
      id="level-3-tools" 
      data-testid="level-3-tool-selection-container"
      className={`py-20 bg-gradient-to-br from-white via-indigo-50/30 to-purple-50/20 ${className}`} 
      {...props}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-testid="level-3-content-wrapper">
        {/* Enhanced Header */}
        <motion.div 
          className="mb-12"
          data-testid="level-3-header-section"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
            data-testid="level-3-back-button-wrapper"
          >
            <BackButton 
              onClick={onBack}
              label="Back to Categories"
              data-testid="level-3-back-to-categories-button"
              className="group inline-flex items-center space-x-3 px-6 py-3 bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl text-gray-700 hover:text-indigo-700 hover:bg-white/90 hover:border-indigo-200/60 font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1"
            />
          </motion.div>

          <div className="text-center mb-12" data-testid="level-3-title-section">
            <motion.div 
              className="flex items-center justify-center space-x-3 mb-6"
              data-testid="level-3-category-header"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div 
                className="w-6 h-6 rounded-full shadow-lg"
                data-testid="level-3-category-color-indicator"
                style={{ backgroundColor: selectedCategory.color || '#3B82F6' }}
              />
              <h2 
                className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-800 via-indigo-700 to-purple-700 bg-clip-text text-transparent"
                data-testid="level-3-category-title"
              >
                {selectedCategory.label} Tools
              </h2>
            </motion.div>
            
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "8rem" }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full mb-6"
              data-testid="level-3-title-underline"
            />
            
            <motion.p 
              className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed"
              data-testid="level-3-category-description"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Discover and compare {selectedCategory.label.toLowerCase()} tools. 
              <br className="hidden md:block" />
              Click on any tool to view <span className="font-semibold text-indigo-600">detailed information</span>, or select multiple tools for comparison.
            </motion.p>
          </div>
        </motion.div>

        {/* Enhanced Search and Filter Controls */}
        <motion.div 
          className="mb-12 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 shadow-lg p-8"
          data-testid="level-3-filters-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-end gap-6" data-testid="level-3-filters-container">
            {/* Enhanced Search */}
            {/* <div className="flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search tools..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200/60 rounded-xl bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-300/60 transition-all duration-300 placeholder-gray-400 text-gray-700"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <svg className="text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div> */}
            
            {/* Enhanced Filters */}
            <div className="flex items-center justify-end gap-4" data-testid="level-3-view-mode-filters">
                            
              <div className="flex flex-col sm:flex-row bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl overflow-hidden shadow-sm" data-testid="level-3-view-mode-toggle">
                <motion.button
                  onClick={() => setViewMode('grid')}
                  data-testid="level-3-grid-view-button"
                  className={`px-4 py-3 text-sm font-medium transition-all duration-300 ${
                    viewMode === 'grid' 
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg' 
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50/80'
                  }`}
                  whileHover={{ scale: viewMode !== 'grid' ? 1.05 : 1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" data-testid="level-3-grid-view-icon">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </motion.button>
                <motion.button
                  onClick={() => setViewMode('list')}
                  data-testid="level-3-list-view-button"
                  className={`px-4 py-3 text-sm font-medium transition-all duration-300 ${
                    viewMode === 'list' 
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg' 
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50/80'
                  }`}
                  whileHover={{ scale: viewMode !== 'list' ? 1.05 : 1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" data-testid="level-3-list-view-icon">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </motion.button>
              </div>
            </div>
          </div>
         
        </motion.div>
       
        {/* Enhanced Tools Grid/List */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={viewMode}
            data-testid={`level-3-tools-${viewMode}-container`}
            className={
              viewMode === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {tools.map((tool) => {
              const complexityInfo = getComplexityInfo(tool.complexity)
              const isToolComparing = isComparing(tool)

              return (
                <motion.div
                  key={tool.id}
                  data-testid={`level-3-tool-card-${tool.id}`}
                  variants={cardVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className={`
                    group relative cursor-pointer rounded-2xl overflow-hidden backdrop-blur-sm
                    ${selectedTool?.id === tool.id 
                      ? 'ring-4 ring-indigo-500 shadow-2xl shadow-indigo-500/25 scale-105' 
                      : 'shadow-lg hover:shadow-xl hover:shadow-indigo-200/30'
                    }
                    ${isToolComparing ? 'ring-2 ring-indigo-300 bg-indigo-50/80' : 'bg-white/90 hover:bg-white'}
                    transition-all duration-500 ease-out
                    ${viewMode === 'list' ? 'flex items-center' : ''}
                  `}
                  onClick={() => handleToolSelect(tool)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Select ${tool.label} tool`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      handleToolSelect(tool)
                    }
                  }}
                >
                  <div className={`p-6 ${viewMode === 'list' ? 'flex items-center flex-1 space-x-6' : ''}`} data-testid={`level-3-tool-content-${tool.id}`}>
                    {/* Icon and Basic Info */}
                    <div className={`flex items-center ${viewMode === 'list' ? 'space-x-4' : 'justify-between mb-4'}`} data-testid={`level-3-tool-header-${tool.id}`}>
                      <div className="flex items-center space-x-3" data-testid={`level-3-tool-info-${tool.id}`}>
                        <div className="text-3xl flex-shrink-0" data-testid={`level-3-tool-icon-${tool.id}`}>
                          {getToolIcon(tool)}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900" data-testid={`level-3-tool-name-${tool.id}`}>
                            {tool.label}
                          </h3>
                          {tool.popular && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 mt-1" data-testid={`level-3-tool-popular-badge-${tool.id}`}>
                              🔥 Popular
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Enhanced Compare Toggle - Always Visible */}
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation()
                          onToggleCompare?.(tool)
                        }}
                        data-testid={`level-3-tool-compare-button-${tool.id}`}
                        className={`
                          group relative p-2 rounded-lg transition-all duration-300 hover:scale-110 flex-shrink-0 shadow-sm hover:shadow-md
                          ${isToolComparing 
                            ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-200' 
                            : 'bg-white/90 backdrop-blur-sm text-gray-500 hover:text-indigo-600 hover:bg-white border border-gray-300/60'
                          }
                        `}
                        aria-label={`${isToolComparing ? 'Remove from' : 'Add to'} comparison`}
                        whileHover={{ scale: 1.1, rotate: isToolComparing ? 0 : 5 }}
                        whileTap={{ scale: 0.9 }}
                        title={`${isToolComparing ? 'Remove from' : 'Add to'} comparison`}
                      >
                        {isToolComparing ? (
                          <motion.svg 
                            className="w-4 h-4" 
                            fill="currentColor" 
                            viewBox="0 0 20 20"
                            data-testid={`level-3-tool-compare-checked-icon-${tool.id}`}
                            initial={{ rotate: -90 }}
                            animate={{ rotate: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </motion.svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-testid={`level-3-tool-compare-plus-icon-${tool.id}`}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        )}
                      </motion.button>
                    </div>

                    {/* Description */}
                    {tool['What is it?'] && (
                      <p className={`text-sm text-gray-600 leading-relaxed ${viewMode === 'list' ? 'flex-1' : 'mb-4'}`} data-testid={`level-3-tool-description-${tool.id}`}>
                        {tool['What is it?'].substring(0, viewMode === 'list' ? 120 : 80)}
                        {tool['What is it?'].length > (viewMode === 'list' ? 120 : 80) ? '...' : ''}
                      </p>
                    )}

                    {/* Metadata */}
                    <div className={`${viewMode === 'list' ? 'flex items-center space-x-4' : 'space-y-3'}`} data-testid={`level-3-tool-metadata-${tool.id}`}>
                      {/* Platforms */}
                      {tool.platforms && (
                        <div className={viewMode === 'list' ? '' : 'mb-2'} data-testid={`level-3-tool-platforms-${tool.id}`}>
                          <div className="flex flex-wrap gap-1">
                            {tool.platforms.slice(0, 3).map((platform, index) => (
                              <span 
                                key={platform}
                                data-testid={`level-3-tool-platform-badge-${tool.id}-${index}`}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                              >
                                {platform}
                              </span>
                            ))}
                            {tool.platforms.length > 3 && (
                              <span className="text-xs text-gray-500" data-testid={`level-3-tool-platforms-more-${tool.id}`}>
                                +{tool.platforms.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Complexity and License */}
                      <div className={`flex items-center ${viewMode === 'list' ? 'space-x-2' : 'justify-between'}`} data-testid={`level-3-tool-badges-${tool.id}`}>
                        {tool.complexity && (
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${complexityInfo.bgColor} ${complexityInfo.textColor}`} data-testid={`level-3-tool-complexity-badge-${tool.id}`}>
                            {complexityInfo.label}
                          </span>
                        )}
                        
                        {tool.license && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800" data-testid={`level-3-tool-license-badge-${tool.id}`}>
                            {tool.license}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Enhanced Action Button (Grid view only) */}
                    {viewMode === 'grid' && (
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleToolSelect(tool)
                        }}
                        data-testid={`level-3-tool-details-button-${tool.id}`}
                        className="w-full mt-6 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-6 py-3 rounded-xl text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 group"
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span className="flex items-center justify-center space-x-2" data-testid={`level-3-tool-details-button-content-${tool.id}`}>
                          <span>View Details</span>
                          <motion.svg 
                            className="w-4 h-4" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                            data-testid={`level-3-tool-details-button-arrow-${tool.id}`}
                            animate={{ x: [0, 3, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </motion.svg>
                        </span>
                      </motion.button>
                    )}
                  </div>

                  {/* Selection Indicator */}
                  {selectedTool?.id === tool.id && (
                    <motion.div 
                      className="absolute top-3 right-3"
                      data-testid={`level-3-tool-selected-indicator-${tool.id}`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center" data-testid={`level-3-tool-selected-icon-${tool.id}`}>
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path 
                            fillRule="evenodd" 
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                            clipRule="evenodd" 
                          />
                        </svg>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )
            })}
          </motion.div>
        </AnimatePresence>

        {/* Enhanced No Results */}
        {tools.length === 0 && (
          <motion.div 
            className="text-center py-16 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200/60 shadow-lg"
            data-testid="level-3-no-results-container"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <motion.div 
              className="text-6xl mb-6"
              data-testid="level-3-no-results-icon"
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            >
              🔍
            </motion.div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3" data-testid="level-3-no-results-title">No tools found</h3>
            <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto" data-testid="level-3-no-results-description">
              Try adjusting your search criteria or filters to discover relevant tools for your project.
            </p>
            <motion.button
              onClick={onClearFilters}
              data-testid="level-3-clear-filters-button"
              className="group inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-testid="level-3-clear-filters-icon">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span data-testid="level-3-clear-filters-text">Clear all filters</span>
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  )
}

Level3ToolSelection.propTypes = {
  tools: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    icon: PropTypes.string,
    platforms: PropTypes.arrayOf(PropTypes.string),
    complexity: PropTypes.number,
    popular: PropTypes.bool,
    license: PropTypes.string,
    'What is it?': PropTypes.string,
  })),
  selectedStack: PropTypes.object,
  selectedCategory: PropTypes.object,
  selectedTool: PropTypes.object,
  compareTools: PropTypes.array,
  searchQuery: PropTypes.string,
  filters: PropTypes.object,
  onSelectTool: PropTypes.func.isRequired,
  onToggleCompare: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onClearFilters: PropTypes.func.isRequired,
  className: PropTypes.string,
}

export default Level3ToolSelection
