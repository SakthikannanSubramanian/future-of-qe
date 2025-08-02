import React from 'react'
import PropTypes from 'prop-types'

const CategoryCard = ({ 
  category, 
  isSelected, 
  onClick,
  className = '',
  ...props 
}) => {
  const handleClick = () => {
    onClick?.(category)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick()
    }
  }

  return (
    <div
      className={`
        relative group cursor-pointer rounded-xl border-2 transition-all duration-300 
        bg-white hover:bg-gray-50 hover:scale-105 hover:shadow-lg
        ${isSelected 
          ? 'border-primary-500 shadow-lg ring-4 ring-primary-100' 
          : 'border-gray-200 hover:border-primary-300'
        }
        ${className}
      `}
      data-testid={`category-card-${category.label}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-pressed={isSelected}
      aria-label={`Select ${category.label} category`}
      {...props}
    >
      {/* Card content */}
      <div className="p-6 h-full flex flex-col items-center justify-center text-center" data-testid="category-card-content">
        {/* Icon */}
        {category.icon && (
          <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300" data-testid="category-card-icon">
            {category.icon}
          </div>
        )}
        
        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors" data-testid="category-card-title">
          {category.label}
        </h3>
        
        {/* Type badge */}
        {category.type && (
          <span 
            className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
            data-testid="category-card-type-badge"
            style={{ 
              backgroundColor: category.color ? `${category.color}20` : '#f3f4f6',
              color: category.color || '#6b7280'
            }}
          >
            {category.type}
          </span>
        )}
      </div>

      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute top-2 right-2">
          <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path 
                fillRule="evenodd" 
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                clipRule="evenodd" 
              />
            </svg>
          </div>
        </div>
      )}

      {/* Hover effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary-500/0 to-primary-600/0 group-hover:from-primary-500/5 group-hover:to-primary-600/10 transition-all duration-300" />
    </div>
  )
}

CategoryCard.propTypes = {
  category: PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    icon: PropTypes.string,
    type: PropTypes.string,
    color: PropTypes.string,
  }).isRequired,
  isSelected: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string,
}

export default CategoryCard
