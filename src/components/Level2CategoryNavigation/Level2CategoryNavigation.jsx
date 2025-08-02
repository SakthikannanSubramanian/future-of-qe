import React from 'react'
import { motion } from 'framer-motion'
import PropTypes from 'prop-types'
import BackButton from '../BackButton/BackButton'

const Level2CategoryNavigation = ({ 
  categories = [],
  selectedStack,
  selectedCategory,
  onSelectCategory,
  onBack,
  className = '',
  ...props 
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      x: -30,
      scale: 0.95 
    },
    visible: { 
      opacity: 1, 
      x: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    },
    hover: { 
      scale: 1.03,
      y: -5,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    },
    tap: { 
      scale: 0.98 
    }
  }

  const handleCategorySelect = (category) => {
    onSelectCategory?.(category)
    
    // Smooth scroll to next section
    setTimeout(() => {
      const nextSection = document.getElementById('level-3-tools')
      if (nextSection) {
        nextSection.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        })
      }
    }, 300)
  }

  if (!selectedStack) {
    return (
      <div id="level-2-categories" className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Stack Selected</h2>
          <p className="text-gray-600 mb-4">Please select a technology stack first.</p>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
          >
            Back to Stacks
          </button>
        </div>
      </div>
    )
  }

  if (!Array.isArray(categories) || categories.length === 0) {
    return (
      <div id="level-2-categories" className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Categories Found</h2>
          <p className="text-gray-600 mb-4">The selected stack has no categories.</p>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
          >
            Back to Stacks
          </button>
        </div>
      </div>
    )
  }

  return (
    <div id="level-2-categories" className={`py-20 bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 ${className}`} {...props}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <BackButton 
              onClick={onBack}
              label="Back to Tech Stacks"
              className="group inline-flex items-center space-x-3 px-6 py-3 bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl text-gray-700 hover:text-indigo-700 hover:bg-white/90 hover:border-indigo-200/60 font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1"
            />
          </motion.div>

          <div className="text-center">
            <motion.div 
              className="flex items-center justify-center space-x-4 mb-6"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.span 
                className="text-5xl filter drop-shadow-lg"
                whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                transition={{ duration: 0.6 }}
              >
                {selectedStack.icon}
              </motion.span>
              <div>
                <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-800 via-indigo-700 to-purple-700 bg-clip-text text-transparent">
                  {selectedStack.label}
                </h2>
                <div className="text-lg text-indigo-600 font-medium mt-1">
                  Testing Categories
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "6rem" }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full mb-6"
            />
            
            <motion.p 
              className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Choose a testing methodology to explore specialized tools and frameworks. 
              <br className="hidden md:block" />
              Each category contains <span className="font-semibold text-indigo-600">carefully curated tools</span> for specific testing needs.
            </motion.p>
          </div>
        </motion.div>

        {/* Enhanced Categories Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              variants={cardVariants}
              whileHover="hover"
              whileTap="tap"
              className={`
                group relative cursor-pointer rounded-2xl overflow-hidden backdrop-blur-sm
                ${selectedCategory?.id === category.id 
                  ? 'ring-4 ring-indigo-500 shadow-2xl shadow-indigo-500/25 scale-105' 
                  : 'shadow-lg hover:shadow-xl hover:shadow-indigo-200/30'
                }
                transition-all duration-500 bg-white/90 hover:bg-white
              `}
              onClick={() => handleCategorySelect(category)}
              role="button"
              tabIndex={0}
              aria-label={`Select ${category.label} testing category`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handleCategorySelect(category)
                }
              }}
            >
              {/* Gradient Top Bar */}
              <div 
                className="h-2 bg-gradient-to-r"
                style={{ 
                  background: `linear-gradient(90deg, ${category.color || '#3B82F6'}, ${category.color || '#3B82F6'}80)` 
                }}
              />

              {/* Content */}
              <div className="p-8">
                {/* Header with enhanced styling */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    {/* Type Badge with glow effect */}
                    {category.type && (
                      <motion.div 
                        className="mb-4"
                        whileHover={{ scale: 1.05 }}
                      >
                        <span 
                          className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold text-white shadow-lg"
                          style={{ 
                            backgroundColor: category.color || '#3B82F6',
                            boxShadow: `0 4px 14px ${category.color || '#3B82F6'}30`
                          }}
                        >
                          {category.type}
                        </span>
                      </motion.div>
                    )}

                    {/* Title with gradient */}
                    <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent group-hover:from-indigo-700 group-hover:to-purple-600 transition-all duration-300">
                      {category.label}
                    </h3>

                    {/* Description */}
                    {category.description && (
                      <p className="text-gray-600 leading-relaxed mb-6 text-sm">
                        {category.description}
                      </p>
                    )}
                  </div>

                  {/* Enhanced Tool Count Badge */}
                  <motion.div 
                    className="ml-6 flex-shrink-0"
                    whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                    transition={{ duration: 0.6 }}
                  >
                    <div 
                      className="w-16 h-16 rounded-2xl flex flex-col items-center justify-center text-white font-bold shadow-lg group-hover:shadow-xl transition-all duration-300"
                      style={{ 
                        background: `linear-gradient(135deg, ${category.color || '#3B82F6'}, ${category.color || '#3B82F6'}dd)`,
                        boxShadow: `0 8px 25px ${category.color || '#3B82F6'}30`
                      }}
                    >
                      <div className="text-xl">{category.toolCount || 0}</div>
                      <div className="text-xs opacity-90">tools</div>
                    </div>
                  </motion.div>
                </div>

                {/* Enhanced Footer */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category.color || '#3B82F6' }}
                    />
                    <span className="text-sm text-gray-500 font-medium">
                      {category.toolCount === 1 ? '1 Tool' : `${category.toolCount || 0} Tools`} Available
                    </span>
                  </div>
                  
                  {/* Enhanced Arrow */}
                  <motion.div
                    className="text-gray-400 group-hover:text-indigo-500"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </motion.div>
                </div>

                {/* Selection Indicator */}
                {selectedCategory?.id === category.id && (
                  <motion.div 
                    className="absolute top-4 right-4"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path 
                          fillRule="evenodd" 
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                          clipRule="evenodd" 
                        />
                      </svg>
                    </div>
                  </motion.div>
                )}

                {/* Shimmer Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced Selected Category Info */}
        {selectedCategory && (
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <motion.div 
              className="inline-flex items-center space-x-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                const nextSection = document.getElementById('level-3-tools')
                if (nextSection) {
                  nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }
              }}
            >
              <div 
                className="w-4 h-4 rounded-full shadow-inner"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
              />
              <div className="text-left">
                <div className="font-semibold text-lg">
                  Explore {selectedCategory.label} Tools
                </div>
                <div className="text-indigo-100 text-sm">
                  {selectedCategory.toolCount || 0} specialized tools available
                </div>
              </div>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="text-2xl"
              >
                →
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

Level2CategoryNavigation.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    description: PropTypes.string,
    type: PropTypes.string,
    color: PropTypes.string,
    toolCount: PropTypes.number,
  })),
  selectedStack: PropTypes.object,
  selectedCategory: PropTypes.object,
  onSelectCategory: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  className: PropTypes.string,
}

export default Level2CategoryNavigation
