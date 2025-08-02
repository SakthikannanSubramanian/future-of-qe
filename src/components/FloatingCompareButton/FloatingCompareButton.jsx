import React from 'react'
import PropTypes from 'prop-types'

const FloatingCompareButton = ({ 
  compareCount = 0,
  onClick,
  className = '',
  ...props 
}) => {
  if (compareCount === 0) return null

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`} {...props}>
      <button
        onClick={onClick}
        className="group relative bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        aria-label={`Compare ${compareCount} selected tools`}
      >
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
          </svg>
          <span className="font-medium">Compare ({compareCount})</span>
        </div>

        {/* Animated pulse effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
        
        {/* Badge */}
        {compareCount > 0 && (
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
            {compareCount > 9 ? '9+' : compareCount}
          </div>
        )}
      </button>
    </div>
  )
}

FloatingCompareButton.propTypes = {
  compareCount: PropTypes.number,
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
}

export default FloatingCompareButton
