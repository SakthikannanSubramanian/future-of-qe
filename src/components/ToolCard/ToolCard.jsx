import React from 'react'
import PropTypes from 'prop-types'

const ToolCard = ({ 
  tool, 
  isSelected, 
  isComparing = false,
  onSelect,
  onCompareToggle,
  onViewDetails,
  className = '',
  ...props 
}) => {
  const handleSelect = () => {
    onSelect?.(tool)
  }

  const handleCompareToggle = (e) => {
    e.stopPropagation()
    onCompareToggle?.(tool)
  }

  const handleViewDetails = (e) => {
    e.stopPropagation()
    onViewDetails?.(tool)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleSelect()
    }
  }

  const getComplexityColor = (complexity) => {
    switch (complexity) {
      case 1: return 'text-green-600 bg-green-100'
      case 2: return 'text-yellow-600 bg-yellow-100'
      case 3: return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getComplexityLabel = (complexity) => {
    switch (complexity) {
      case 1: return 'Easy'
      case 2: return 'Medium'
      case 3: return 'Advanced'
      default: return 'Unknown'
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
      onClick={handleSelect}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-pressed={isSelected}
      aria-label={`Select ${tool.label} tool`}
      {...props}
    >
      {/* Card content */}
      <div className="p-6 h-full flex flex-col" data-testid={`tool-card-content-${tool.id}`}> 
        {/* Header */}
        <div className="flex items-start justify-between mb-4" data-testid="tool-card-header">
          <div className="flex items-center space-x-3">
            {/* Icon */}
            {tool.icon && (
              <div className="text-3xl group-hover:scale-110 transition-transform duration-300" data-testid="tool-card-icon">{tool.icon}</div>
            )}
            
            {/* Title and Popular badge */}
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors" data-testid="tool-card-title">
                  {tool.label}
                </h3>
                {tool.popular && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800" data-testid="tool-card-popular-badge">
                    🔥 Popular
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Compare checkbox */}
          <button
            onClick={handleCompareToggle}
            className={`
              p-2 rounded-lg transition-all duration-200 hover:scale-110
              ${isComparing 
                ? 'bg-primary-100 text-primary-600' 
                : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600'
              }
            `}
            aria-label={`${isComparing ? 'Remove from' : 'Add to'} comparison`}
            data-testid="tool-card-compare-button"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
            </svg>
          </button>
        </div>

        {/* Metadata */}
        <div className="flex flex-wrap gap-2 mb-4" data-testid="tool-card-metadata">
          {/* Platforms */}
          {tool.platforms && tool.platforms.map(platform => (
            <span 
              key={platform}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              data-testid={`tool-card-platform-${platform}`}
            >
              {platform}
            </span>
          ))}
          
          {/* Complexity */}
          {tool.complexity && (
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getComplexityColor(tool.complexity)}`} data-testid="tool-card-complexity-badge">
              {getComplexityLabel(tool.complexity)}
            </span>
          )}
          
          {/* License */}
          {tool.license && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800" data-testid="tool-card-license-badge">
              {tool.license}
            </span>
          )}
        </div>

        {/* Description */}
        {tool['What is it?'] && (
          <p className="text-sm text-gray-600 flex-grow mb-4 line-clamp-3" data-testid="tool-card-description">
            {tool['What is it?']}
          </p>
        )}

        {/* Actions */}
        <div className="flex space-x-2 mt-auto" data-testid="tool-card-actions">
          <button
            onClick={handleViewDetails}
            className="flex-1 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
            data-testid="tool-card-view-details-button"
          >
            View Details
          </button>
          
          {tool['Install Command'] && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                navigator.clipboard.writeText(tool['Install Command'])
              }}
              className="px-4 py-2 border border-gray-300 hover:border-gray-400 text-gray-700 rounded-lg text-sm font-medium transition-colors duration-200 hover:bg-gray-50"
              title="Copy install command"
              data-testid="tool-card-copy-install"
            >
              📋
            </button>
          )}
        </div>
      </div>

      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute top-2 right-12" data-testid="tool-card-selected-indicator">
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

ToolCard.propTypes = {
  tool: PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    icon: PropTypes.string,
    platforms: PropTypes.arrayOf(PropTypes.string),
    complexity: PropTypes.number,
    popular: PropTypes.bool,
    license: PropTypes.string,
    'What is it?': PropTypes.string,
    'Install Command': PropTypes.string,
  }).isRequired,
  isSelected: PropTypes.bool,
  isComparing: PropTypes.bool,
  onSelect: PropTypes.func,
  onCompareToggle: PropTypes.func,
  onViewDetails: PropTypes.func,
  className: PropTypes.string,
}

export default ToolCard
