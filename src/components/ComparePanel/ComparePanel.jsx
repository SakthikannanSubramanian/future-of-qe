import React, { useState } from 'react'
import PropTypes from 'prop-types'

const ComparePanel = ({ 
  tools = [],
  onRemoveTool,
  onClearAll,
  onClose,
  className = '',
  ...props 
}) => {
  const [activeSection, setActiveSection] = useState('overview')
  
  const sections = [
    { id: 'overview', label: 'Overview', icon: '📋' },
    { id: 'features', label: 'Features', icon: '⚡' },
    { id: 'complexity', label: 'Complexity', icon: '📊' },
    { id: 'installation', label: 'Installation', icon: '⚙️' },
    { id: 'resources', label: 'Resources', icon: '📚' },
  ]

  const getComplexityInfo = (complexity) => {
    switch (complexity) {
      case 1: return { label: 'Easy', color: 'bg-green-100 text-green-800', score: 1 }
      case 2: return { label: 'Medium', color: 'bg-yellow-100 text-yellow-800', score: 2 }
      case 3: return { label: 'Advanced', color: 'bg-red-100 text-red-800', score: 3 }
      default: return { label: 'Unknown', color: 'bg-gray-100 text-gray-800', score: 0 }
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {tools.map(tool => (
                <div key={tool.id} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      {tool.icon && <span className="text-2xl">{tool.icon}</span>}
                      <div>
                        <h3 className="font-semibold text-gray-900">{tool.label}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          {tool.popular && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                              🔥 Popular
                            </span>
                          )}
                          {tool.license && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {tool.license}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => onRemoveTool?.(tool)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      aria-label={`Remove ${tool.label} from comparison`}
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                  
                  {tool['What is it?'] && (
                    <p className="text-sm text-gray-700 mb-3">{tool['What is it?']}</p>
                  )}
                  
                  {tool.platforms && (
                    <div className="flex flex-wrap gap-1">
                      {tool.platforms.map(platform => (
                        <span 
                          key={platform}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                        >
                          {platform}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )

      case 'features':
        return (
          <div className="space-y-6">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Feature</th>
                    {tools.map(tool => (
                      <th key={tool.id} className="text-center py-3 px-4 font-medium text-gray-900 min-w-[150px]">
                        <div className="flex items-center justify-center space-x-2">
                          {tool.icon && <span>{tool.icon}</span>}
                          <span>{tool.label}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="py-3 px-4 font-medium text-gray-700">Platforms</td>
                    {tools.map(tool => (
                      <td key={tool.id} className="py-3 px-4 text-center">
                        {tool.platforms ? (
                          <div className="flex flex-wrap justify-center gap-1">
                            {tool.platforms.map(platform => (
                              <span 
                                key={platform}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                              >
                                {platform}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    ))}
                  </tr>
                  
                  <tr>
                    <td className="py-3 px-4 font-medium text-gray-700">License</td>
                    {tools.map(tool => (
                      <td key={tool.id} className="py-3 px-4 text-center">
                        {tool.license ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {tool.license}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    ))}
                  </tr>
                  
                  <tr>
                    <td className="py-3 px-4 font-medium text-gray-700">Popularity</td>
                    {tools.map(tool => (
                      <td key={tool.id} className="py-3 px-4 text-center">
                        {tool.popular ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                            🔥 Popular
                          </span>
                        ) : (
                          <span className="text-gray-400">Standard</span>
                        )}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )

      case 'complexity':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools.map(tool => {
                const complexityInfo = getComplexityInfo(tool.complexity)
                return (
                  <div key={tool.id} className="border rounded-lg p-4 text-center">
                    <div className="flex items-center justify-center space-x-2 mb-3">
                      {tool.icon && <span className="text-2xl">{tool.icon}</span>}
                      <h3 className="font-semibold text-gray-900">{tool.label}</h3>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex justify-center mb-2">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${complexityInfo.color}`}>
                          {complexityInfo.label}
                        </span>
                      </div>
                      
                      {/* Complexity bars */}
                      <div className="flex justify-center space-x-1">
                        {[1, 2, 3].map(level => (
                          <div
                            key={level}
                            className={`w-6 h-2 rounded-full ${
                              level <= complexityInfo.score 
                                ? level === 1 ? 'bg-green-400' : level === 2 ? 'bg-yellow-400' : 'bg-red-400'
                                : 'bg-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600">
                      {complexityInfo.score === 1 && 'Beginner-friendly with minimal setup'}
                      {complexityInfo.score === 2 && 'Moderate learning curve'}
                      {complexityInfo.score === 3 && 'Advanced expertise required'}
                      {complexityInfo.score === 0 && 'Complexity not specified'}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        )

      case 'installation':
        return (
          <div className="space-y-6">
            {tools.map(tool => (
              <div key={tool.id} className="border rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  {tool.icon && <span className="text-2xl">{tool.icon}</span>}
                  <h3 className="font-semibold text-gray-900">{tool.label}</h3>
                </div>
                
                {tool['Install Command'] ? (
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
                ) : (
                  <p className="text-gray-500 text-sm">No installation command available</p>
                )}
              </div>
            ))}
          </div>
        )

      case 'resources':
        return (
          <div className="space-y-6">
            {tools.map(tool => (
              <div key={tool.id} className="border rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  {tool.icon && <span className="text-2xl">{tool.icon}</span>}
                  <h3 className="font-semibold text-gray-900">{tool.label}</h3>
                </div>
                
                <div className="space-y-2">
                  {tool['Reference Docs'] && (
                    <a
                      href={tool['Reference Docs']}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-primary-600 bg-primary-100 hover:bg-primary-200 transition-colors"
                    >
                      📚 Official Documentation
                    </a>
                  )}
                  
                  {!tool['Reference Docs'] && (
                    <p className="text-gray-500 text-sm">No documentation links available</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )

      default:
        return null
    }
  }

  if (tools.length === 0) {
    return (
      <div className={`bg-white rounded-xl shadow-lg p-8 text-center ${className}`} {...props}>
        <div className="text-4xl mb-4">📊</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Tools Selected</h3>
        <p className="text-gray-600">Select tools to compare their features, complexity, and more.</p>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden ${className}`} {...props}>
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Tool Comparison</h2>
            <p className="text-indigo-100 text-sm">{tools.length} tools selected</p>
          </div>
          
          <div className="flex items-center space-x-2">
            {tools.length > 0 && (
              <button
                onClick={onClearAll}
                className="px-4 py-2 bg-indigo-400 text-white rounded-lg hover:bg-indigo-300 transition-colors font-medium"
              >
                Clear All
              </button>
            )}
            
            <button
              onClick={onClose}
              className="p-2 text-white hover:bg-indigo-400 rounded-lg transition-colors"
              aria-label="Close comparison"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Section navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm transition-colors
                ${activeSection === section.id
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <span className="mr-2">{section.icon}</span>
              {section.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Section content */}
      <div className="p-6 overflow-y-auto max-h-[60vh]">
        {renderSectionContent()}
      </div>
    </div>
  )
}

ComparePanel.propTypes = {
  tools: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    icon: PropTypes.string,
    platforms: PropTypes.arrayOf(PropTypes.string),
    complexity: PropTypes.number,
    popular: PropTypes.bool,
    license: PropTypes.string,
    'What is it?': PropTypes.string,
    'Install Command': PropTypes.string,
    'Reference Docs': PropTypes.string,
  })),
  onRemoveTool: PropTypes.func,
  onClearAll: PropTypes.func,
  onClose: PropTypes.func.isRequired,
  className: PropTypes.string,
}

export default ComparePanel
