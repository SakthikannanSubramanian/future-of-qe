import React from 'react'
import PropTypes from 'prop-types'

const BackButton = ({ 
  onClick,
  label = 'Back',
  className = '',
  ...props 
}) => {
  const handleClick = () => {
    onClick?.()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick()
    }
  }

  return (
    <button
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`
        inline-flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 
        hover:bg-gray-100 rounded-lg transition-all duration-200 font-medium
        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
        ${className}
      `}
      aria-label={label}
      {...props}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      <span>{label}</span>
    </button>
  )
}

BackButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  label: PropTypes.string,
  className: PropTypes.string,
}

export default BackButton
