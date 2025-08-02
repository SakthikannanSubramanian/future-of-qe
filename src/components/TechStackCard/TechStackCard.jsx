import React from 'react'
import PropTypes from 'prop-types'
import { motion } from 'framer-motion'

const getStackIcon = (stackId) => {
  const icons = {
    frontend: '�',
    backend: '⚙️',
    mobile: '📱',
    devops: '�',
    database: '🗄️',
    security: '🔒',
    performance: '⚡',
    automation: '🤖'
  }
  return icons[stackId] || '🔧'
}

const getStackColor = (stackId) => {
  const colors = {
    frontend: '#3B82F6',
    backend: '#10B981',
    mobile: '#EF4444',
    devops: '#6366F1',
    database: '#8B5CF6',
    security: '#F59E0B',
    performance: '#06B6D4',
    automation: '#84CC16'
  }
  return colors[stackId] || '#6B7280'
}

const TechStackCard = ({ stack, onClick, className = '', isActive = false }) => {
  const stackColor = getStackColor(stack.id)
  
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
        duration: 0.5,
        ease: "easeOut"
      }
    },
    hover: { 
      scale: 1.05,
      y: -8,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    tap: { 
      scale: 0.98 
    }
  }

  const handleClick = () => {
    if (onClick) {
      onClick(stack)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick()
    }
  }

  return (
    <motion.div
      className={`
        group relative cursor-pointer rounded-3xl overflow-hidden backdrop-blur-sm
        ${isActive 
          ? 'ring-4 ring-indigo-500 shadow-2xl shadow-indigo-500/25 scale-105' 
          : 'shadow-xl hover:shadow-2xl shadow-gray-200/50 hover:shadow-indigo-200/30'
        }
        transition-all duration-500 ease-out
        bg-white/80 hover:bg-white/90
        aspect-square min-h-[280px] max-w-[280px] w-full
        ${className}
      `}
      variants={cardVariants}
      whileHover="hover"
      whileTap="tap"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-pressed={isActive}
      aria-label={`Select ${stack.label} technology stack`}
      style={{
        '--stack-color': stackColor
      }}
    >
      {/* Dynamic Gradient Background */}
      <div 
        className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500"
        style={{
          background: `linear-gradient(135deg, ${stackColor}20, ${stackColor}10)`
        }}
      />
      
      {/* Animated Border Effect */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Content Container */}
      <div className="relative h-full p-8 flex flex-col items-center justify-center text-center">
        {/* Floating Icon Container */}
        <motion.div 
          className="mb-6 w-20 h-20 rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-500"
          style={{
            background: `linear-gradient(135deg, ${stackColor}15, ${stackColor}25)`,
            backdropFilter: 'blur(10px)'
          }}
          whileHover={{ 
            rotate: [0, -5, 5, 0],
            scale: 1.1
          }}
          transition={{ 
            duration: 0.6,
            ease: "easeInOut"
          }}
        >
          <motion.span 
            className="text-4xl filter drop-shadow-lg"
            whileHover={{ scale: 1.2 }}
            transition={{ duration: 0.3 }}
          >
            {getStackIcon(stack.id)}
          </motion.span>
        </motion.div>

        {/* Stack Title */}
        <motion.h3 
          className={`text-xl font-bold mb-3 transition-colors duration-300 ${
            isActive ? 'text-indigo-700' : 'text-gray-800 group-hover:text-gray-900'
          }`}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          {stack.label}
        </motion.h3>

        {/* Active State Indicator */}
        {isActive && (
          <motion.div
            className="absolute top-4 right-4 w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center shadow-lg"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <motion.span 
              className="text-white text-sm"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              ✓
            </motion.span>
          </motion.div>
        )}

        {/* Hover Glow Effect */}
        <div 
          className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `radial-gradient(circle at center, ${stackColor}30, transparent 70%)`
          }}
        />
      </div>
    </motion.div>
  )
}

TechStackCard.propTypes = {
  stack: PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  }).isRequired,
  onClick: PropTypes.func,
  className: PropTypes.string,
  isActive: PropTypes.bool,
}

export default TechStackCard
