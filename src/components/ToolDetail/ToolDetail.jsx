import React, { useState } from 'react'
import PropTypes from 'prop-types'

const ToolDetail = ({ 
  tool, 
  onClose,
  onCompareToggle,
  isComparing = false,
  className = '',
  ...props 
}) => {
  const [activeTab, setActiveTab] = useState('overview')

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📋' },
    { id: 'case-study', label: 'Case Study', icon: '📊' },
    { id: 'samples', label: 'Code Samples', icon: '💻' },
    { id: 'comparison', label: 'Comparison', icon: '⚖️' },
    { id: 'docs', label: 'Resources', icon: '📚' },
  ]

  const getComplexityInfo = (complexity) => {
    switch (complexity) {
      case 1: return { label: 'Easy', color: 'text-green-600 bg-green-100', description: 'Beginner-friendly with minimal setup' }
      case 2: return { label: 'Medium', color: 'text-yellow-600 bg-yellow-100', description: 'Moderate learning curve with some configuration' }
      case 3: return { label: 'Advanced', color: 'text-red-600 bg-red-100', description: 'Complex setup requiring significant expertise' }
      default: return { label: 'Unknown', color: 'text-gray-600 bg-gray-100', description: 'Complexity not specified' }
    }
  }

  const complexityInfo = getComplexityInfo(tool.complexity)

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Main description */}
            {tool['What is it?'] && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">What is it?</h3>
                <p className="text-gray-700 leading-relaxed">{tool['What is it?']}</p>
              </div>
            )}

            {/* Metadata grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Platforms */}
              {tool.platforms && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Supported Platforms</h4>
                  <div className="flex flex-wrap gap-2">
                    {tool.platforms.map(platform => (
                      <span 
                        key={platform}
                        className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800"
                      >
                        {platform}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Complexity */}
              {tool.complexity && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Complexity Level</h4>
                  <div className="space-y-2">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium ${complexityInfo.color}`}>
                      {complexityInfo.label}
                    </span>
                    <p className="text-sm text-gray-600">{complexityInfo.description}</p>
                  </div>
                </div>
              )}

              {/* License */}
              {tool.license && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">License</h4>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                    {tool.license}
                  </span>
                </div>
              )}

              {/* Popular badge */}
              {tool.popular && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Community Status</h4>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                    🔥 Popular Choice
                  </span>
                </div>
              )}
            </div>

            {/* Installation */}
            {tool['Install Command'] && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Installation</h4>
                <div className="bg-gray-900 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <code className="text-green-400 font-mono text-sm">{tool['Install Command']}</code>
                    <button
                      onClick={() => copyToClipboard(tool['Install Command'])}
                      className="ml-2 p-1 text-gray-400 hover:text-white transition-colors"
                      title="Copy to clipboard"
                    >
                      📋
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )

      case 'case-study':
        return (
          <div className="space-y-4">
            {tool['Case Study'] ? (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Case Study</h3>
                <div className="bg-purple-50 rounded-lg p-6">
                  <p className="text-gray-700 leading-relaxed">{tool['Case Study']}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">📊</div>
                <p className="text-gray-500">No case study available for this tool.</p>
              </div>
            )}
          </div>
        )

      case 'samples':
        return (
          <div className="space-y-4">
            {tool.Samples ? (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Code Samples</h3>
                <div className="bg-gray-900 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-sm font-mono">Example Usage</span>
                    <button
                      onClick={() => copyToClipboard(tool.Samples)}
                      className="p-1 text-gray-400 hover:text-white transition-colors"
                      title="Copy to clipboard"
                    >
                      📋
                    </button>
                  </div>
                  <pre className="text-green-400 font-mono text-sm overflow-x-auto">
                    <code>{tool.Samples}</code>
                  </pre>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">💻</div>
                <p className="text-gray-500">No code samples available for this tool.</p>
              </div>
            )}
          </div>
        )

      case 'comparison':
        return (
          <div className="space-y-4">
            {tool.Comparison ? (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Comparison Analysis</h3>
                <div className="bg-yellow-50 rounded-lg p-6">
                  <p className="text-gray-700 leading-relaxed">{tool.Comparison}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">⚖️</div>
                <p className="text-gray-500">No comparison information available for this tool.</p>
              </div>
            )}
          </div>
        )

      case 'docs':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Documentation & Resources</h3>
            
            {tool['Reference Docs'] ? (
              <div className="space-y-3">
                <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Official Documentation</h4>
                      <p className="text-sm text-gray-500">Complete reference and guides</p>
                    </div>
                    <a
                      href={tool['Reference Docs']}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-primary-600 bg-primary-100 hover:bg-primary-200 transition-colors"
                    >
                      Visit Docs 🔗
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">📚</div>
                <p className="text-gray-500">No documentation links available for this tool.</p>
              </div>
            )}
          </div>
        )

      default:
        return null
    }
  }

return (
  <div className={`bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden ${className}`} data-testid="tool-detail-container" {...props}>
    {/* Header */}
    <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4" data-testid="tool-detail-header">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {tool.icon && (
            <div className="text-3xl" data-testid="tool-detail-icon">{tool.icon}</div>
          )}
          <div>
            <h2 className="text-2xl font-bold text-white" data-testid="tool-detail-title">{tool.label}</h2>
            <div className="flex items-center space-x-2 mt-1">
              {tool.popular && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800" data-testid="tool-detail-popular-badge">
                  🔥 Popular
                </span>
              )}
              {tool.platforms && (
                <span className="text-primary-100 text-sm" data-testid="tool-detail-platforms">
                  {tool.platforms.join(', ')}
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onCompareToggle?.(tool)}
            className={`
              px-4 py-2 rounded-lg font-medium transition-all duration-200
              ${isComparing 
                ? 'bg-white text-primary-600 hover:bg-gray-100' 
                : 'bg-primary-400 text-white hover:bg-primary-300'
              }
            `}
            data-testid="tool-detail-compare-button"
          >
            {isComparing ? '✓ Comparing' : '+ Compare'}
          </button>
          
          <button
            onClick={onClose}
            className="p-2 text-white hover:bg-primary-400 rounded-lg transition-colors"
            aria-label="Close details"
            data-testid="tool-detail-close-button"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    {/* Tab navigation */}
    <div className="border-b border-gray-200" data-testid="tool-detail-tabs">
      <nav className="flex space-x-8 px-6">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              py-4 px-1 border-b-2 font-medium text-sm transition-colors
              ${activeTab === tab.id
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
            data-testid={`tool-detail-tab-${tab.id}`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </nav>
    </div>

    {/* Tab content */}
    <div className="p-6 overflow-y-auto max-h-[60vh]" data-testid="tool-detail-tab-content">
      {renderTabContent()}
    </div>
  </div>
)
}

ToolDetail.propTypes = {
  tool: PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    icon: PropTypes.string,
    platforms: PropTypes.arrayOf(PropTypes.string),
    complexity: PropTypes.number,
    popular: PropTypes.bool,
    license: PropTypes.string,
    'What is it?': PropTypes.string,
    'Case Study': PropTypes.string,
    'Samples': PropTypes.string,
    'Comparison': PropTypes.string,
    'Reference Docs': PropTypes.string,
    'Install Command': PropTypes.string,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onCompareToggle: PropTypes.func,
  isComparing: PropTypes.bool,
  className: PropTypes.string,
}

export default ToolDetail
