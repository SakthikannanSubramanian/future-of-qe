import React from 'react'
import { motion } from 'framer-motion'
import PropTypes from 'prop-types'

const Level1StackSelection = ({ 
  stacks = [],
  onSelectStack,
  selectedStack,
  className = '',
  ...props 
}) => {
  // Icon mapping for different stack types
  const getStackIcon = (stack) => {
    const iconMap = {
      'frontend': '🌐',
      'backend': '⚙️',
      'mobile-apps': '📱',
      'devops': '🔄',
      'web development': '💻',
      'server development': '🖥️',
      'mobile development': '📲',
      'infrastructure': '🏗️'
    }
    
    // Try to match by id first, then by type, then fall back to provided icon or default
    return iconMap[stack.id?.toLowerCase()] || 
           iconMap[stack.type?.toLowerCase()] || 
           stack.icon || 
           '🔧'
  }
  // Dynamic grid class based on number of stacks
  const getGridClass = (stackCount) => {
    if (stackCount === 1) {
      return 'grid grid-cols-1 place-items-center max-w-md mx-auto'
    } else if (stackCount === 2) {
      return 'grid grid-cols-1 md:grid-cols-2 place-items-center max-w-2xl mx-auto'
    } else if (stackCount === 3) {
      return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 place-items-center max-w-4xl mx-auto'
    } else {
      return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
    }
  }

  // Dynamic card size based on number of stacks
  const getCardClass = (stackCount) => {
    if (stackCount === 1) {
      return 'w-full max-w-sm'
    } else if (stackCount === 2) {
      return 'w-full max-w-sm'
    } else if (stackCount === 3) {
      return 'w-full max-w-xs'
    } else {
      return 'w-full'
    }
  }

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
      y: 30,
      scale: 0.95 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    hover: { 
      scale: 1.05,
      y: -10,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    tap: { 
      scale: 0.98 
    }
  }

  const handleStackSelect = (stack) => {
    onSelectStack?.(stack)
    
    // Smooth scroll to next section
    setTimeout(() => {
      const nextSection = document.getElementById('level-2-categories')
      if (nextSection) {
        nextSection.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        })
      }
    }, 300)
  }

  return (
    <div className={`py-12 ${className}`} {...props}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-6"
          >
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent mb-6">
              QE Tech Stack Finder
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 mx-auto rounded-full"></div>
          </motion.div>
          <motion.p 
            className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Discover the perfect testing tools for your technology stack. 
            <br className="hidden md:block" />
            <span className="text-indigo-600 font-medium">Select a domain</span> to explore comprehensive testing solutions tailored to your needs.
          </motion.p>
        </motion.div>

        {/* Stack Cards Grid */}
        <motion.div 
          className={`${getGridClass(stacks.length)} gap-8 mb-16`}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {stacks.map((stack, index) => (
            <motion.div
              key={stack.id}
              variants={cardVariants}
              whileHover="hover"
              whileTap="tap"
              className={`
                ${getCardClass(stacks.length)}
                group relative cursor-pointer rounded-3xl overflow-hidden backdrop-blur-sm
                ${selectedStack?.id === stack.id 
                  ? 'ring-4 ring-indigo-500 shadow-2xl shadow-indigo-500/25 scale-105' 
                  : 'shadow-xl hover:shadow-2xl shadow-gray-200/50 hover:shadow-indigo-200/30'
                }
                transition-all duration-500 ease-out
                bg-white/80 hover:bg-white/90
              `}
              onClick={() => handleStackSelect(stack)}
              role="button"
              tabIndex={0}
              aria-label={`Select ${stack.label} technology stack`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handleStackSelect(stack)
                }
              }}
              style={{
                '--stack-color': stack.color || '#3B82F6'
              }}
            >
              {/* Gradient Background */}
              <div 
                className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500"
                style={{
                  background: `linear-gradient(135deg, ${stack.color || '#3B82F6'}20, ${stack.color || '#3B82F6'}10)`
                }}
              />
              
              {/* Animated Border */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Content */}
              <div className={`relative p-8 flex flex-col items-center justify-center text-center ${stacks.length === 1 ? 'h-[28rem]' : stacks.length <= 3 ? 'h-96' : 'h-96'}`}>
                {/* Floating Icon */}
                <motion.div 
                  className={`${stacks.length === 1 ? 'text-8xl' : 'text-7xl'} mb-6 filter drop-shadow-lg`}
                  whileHover={{ 
                    scale: 1.1, 
                    rotate: [0, -5, 5, 0],
                    y: -5
                  }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 300, 
                    damping: 10,
                    rotate: { duration: 0.6 }
                  }}
                >
                  {getStackIcon(stack)}
                </motion.div>

                {/* Title with gradient */}
                <h2 className={`${stacks.length === 1 ? 'text-3xl md:text-4xl' : 'text-2xl md:text-3xl'} font-bold mb-4 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent`}>
                  {stack.label}
                </h2>

                {/* Type Badge */}
                {stack.type && (
                  <motion.div 
                    className="mb-4"
                    whileHover={{ scale: 1.05 }}
                  >
                    <span 
                      className={`inline-flex items-center px-4 py-2 rounded-full ${stacks.length === 1 ? 'text-base' : 'text-sm'} font-semibold text-white shadow-lg`}
                      style={{ 
                        backgroundColor: stack.color || '#3B82F6',
                        boxShadow: `0 4px 14px ${stack.color || '#3B82F6'}30`
                      }}
                    >
                      {stack.type}
                    </span>
                  </motion.div>
                )}

                {/* Description for single stack */}
                {stacks.length === 1 && stack.description && (
                  <motion.p 
                    className="text-gray-600 text-center max-w-xs leading-relaxed mb-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {stack.description}
                  </motion.p>
                )}

                {/* Selection Indicator */}
                {selectedStack?.id === stack.id && (
                  <motion.div 
                    className="absolute top-6 right-6"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path 
                          fillRule="evenodd" 
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                          clipRule="evenodd" 
                        />
                      </svg>
                    </div>
                  </motion.div>
                )}

                {/* Hover Arrow */}
                <motion.div 
                  className="absolute bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100"
                  initial={{ y: 10, opacity: 0 }}
                  whileHover={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    animate={{ y: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </motion.div>
                </motion.div>
              </div>

              {/* Shimmer Effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced CTA Section */}
        {selectedStack && (
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <motion.div 
              className="inline-flex items-center space-x-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                const nextSection = document.getElementById('level-2-categories')
                if (nextSection) {
                  nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }
              }}
            >
              <div className="flex items-center space-x-3">
                <span className="text-3xl">{getStackIcon(selectedStack)}</span>
                <div className="text-left">
                  <div className="font-semibold text-lg">
                    Explore {selectedStack.label} Testing
                  </div>
                  <div className="text-indigo-100 text-sm">
                    {selectedStack.categoryCount} categories • {selectedStack.toolCount} tools available
                  </div>
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

Level1StackSelection.propTypes = {
  stacks: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    description: PropTypes.string,
    icon: PropTypes.string,
    type: PropTypes.string,
    color: PropTypes.string,
    categoryCount: PropTypes.number,
    toolCount: PropTypes.number,
  })),
  onSelectStack: PropTypes.func.isRequired,
  selectedStack: PropTypes.object,
  className: PropTypes.string,
}

export default Level1StackSelection
