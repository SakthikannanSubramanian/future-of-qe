import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PropTypes from 'prop-types'
import BackButton from '../BackButton/BackButton'

const Level4ToolDetail = ({ 
  tool,
  selectedCategory,
  isComparing = false,
  onToggleCompare,
  onBack,
  onBookmark,
  onShare,
  onPrint,
  className = '',
  ...props 
}) => {
  const [activeTab, setActiveTab] = useState('overview')
  const [copiedField, setCopiedField] = useState(null)

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '🎯', available: true },
    { id: 'case-study', label: 'Case Study', icon: '�', available: !!tool?.['Case Study'] },
    { id: 'samples', label: 'Code', icon: '⚡', available: !!tool?.['Samples'] },
    { id: 'comparison', label: 'Compare', icon: '🔍', available: !!tool?.['Comparison'] },
    { id: 'resources', label: 'Resources', icon: '�', available: !!tool?.['Reference Docs'] },
    { id: 'benefits', label: 'Benefits', icon: '💎', available: !!tool?.['Benefits'] },
  ].filter(tab => tab.available)

  // Enhanced tool icon mapping with comprehensive fallbacks
  const getToolIcon = (toolName, category) => {
    const iconMap = {
      // Testing Frameworks
      'Jest': '🃏', 'Mocha': '☕', 'Jasmine': '🌸', 'Playwright': '🎭', 'Cypress': '🌲',
      'Selenium': '🔧', 'TestCafe': '☕', 'WebdriverIO': '🌐', 'Puppeteer': '🎪',
      'PyTest': '🐍', 'Robot Framework': '🤖', 'Cucumber': '🥒', 'Appium': '📱',
      'JUnit': '☕', 'TestNG': '⚡', 'NUnit': '🔷', 'XCTest': '🍎', 'RSpec': '💎',
      
      // APIs & Services
      'Postman': '📮', 'Insomnia': '😴', 'REST Assured': '🛡️', 'SoapUI': '🧼',
      'Newman': '📮', 'Karate': '🥋', 'Frisby': '🥏', 'Chakram': '⚡',
      
      // Performance
      'JMeter': '⚡', 'K6': '🚀', 'Artillery': '💥', 'Gatling': '🔫',
      'LoadRunner': '🏃', 'WebPageTest': '📊', 'Lighthouse': '🚨',
      
      // Security
      'OWASP ZAP': '🛡️', 'Burp Suite': '🔒', 'Nessus': '🔍', 'SonarQube': '📊',
      'Checkmarx': '✅', 'Veracode': '🔐', 'Snyk': '🐍',
      
      // CI/CD & DevOps
      'Jenkins': '🏗️', 'GitHub Actions': '⚡', 'GitLab CI': '🦊', 'Azure DevOps': '☁️',
      'CircleCI': '⭕', 'Travis CI': '🚛', 'TeamCity': '🏢', 'Bamboo': '🎍',
      'Docker': '🐳', 'Kubernetes': '⚓', 'Terraform': '🌍',
      
      // Monitoring & Analytics
      'New Relic': '📊', 'Datadog': '🐕', 'Splunk': '💾', 'Elastic': '🔍',
      'Grafana': '📈', 'Prometheus': '🔥', 'AppDynamics': '📱',
      
      // Databases
      'MongoDB': '🍃', 'PostgreSQL': '🐘', 'MySQL': '🐬', 'Redis': '🔴',
      'Oracle': '🔶', 'SQL Server': '🏢', 'Cassandra': '💎',
      
      // Cloud Services
      'AWS': '☁️', 'Azure': '🌐', 'GCP': '🌩️', 'Heroku': '💜', 'Vercel': '▲',
      
      // Languages & Runtimes
      'JavaScript': '🟨', 'TypeScript': '🔷', 'Python': '🐍', 'Java': '☕',
      'C#': '🔷', 'Ruby': '💎', 'Go': '🐹', 'Rust': '🦀', 'PHP': '🐘',
      'Node.js': '🟢', 'React': '⚛️', 'Vue': '💚', 'Angular': '🅰️'
    }

    // Direct match
    if (iconMap[toolName]) return iconMap[toolName]
    
    // Category-based fallback
    const categoryMap = {
      'Testing': '🧪', 'API': '🔌', 'Performance': '⚡', 'Security': '🛡️',
      'CI/CD': '🔄', 'Monitoring': '📊', 'Database': '💾', 'Cloud': '☁️',
      'Frontend': '💻', 'Backend': '⚙️', 'Mobile': '📱', 'DevOps': '🛠️'
    }
    
    if (category && categoryMap[category]) return categoryMap[category]
    
    // Ultimate fallback
    return '🔧'
  }

  const toolIcon = getToolIcon(tool?.Label || tool?.Tool || '', selectedCategory)

  const getComplexityInfo = (complexity) => {
    switch (complexity) {
      case 1: return { 
        label: 'Beginner', 
        color: 'bg-emerald-100 text-emerald-800 border-emerald-200', 
        icon: '🟢',
        description: 'Easy to learn and implement'
      }
      case 2: return { 
        label: 'Intermediate', 
        color: 'bg-amber-100 text-amber-800 border-amber-200', 
        icon: '🟡',
        description: 'Moderate learning curve'
      }
      case 3: return { 
        label: 'Advanced', 
        color: 'bg-red-100 text-red-800 border-red-200', 
        icon: '🔴',
        description: 'Requires significant expertise'
      }
      default: return { 
        label: 'Unknown', 
        color: 'bg-gray-100 text-gray-800 border-gray-200', 
        icon: '⚪',
        description: 'Complexity not specified'
      }
    }
  }

  const copyToClipboard = async (text, fieldName) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(fieldName)
      setTimeout(() => setCopiedField(null), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const complexityInfo = getComplexityInfo(tool?.complexity)

  // Auto-scroll to top when tool changes
  useEffect(() => {
    const detailSection = document.getElementById('level-4-detail')
    if (detailSection) {
      detailSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [tool?.id])

  if (!tool) {
    return null
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <motion.div 
            className="space-y-6"
            data-testid="level-4-overview-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* What is it? */}
            {tool['What is it?'] && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="text-2xl mr-3">💡</span>
                  What is it?
                </h3>
                <p className="text-gray-700 leading-relaxed text-base">{tool['What is it?']}</p>
              </div>
            )}

            {/* Key Information Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Platforms */}
              {tool.platforms && tool.platforms.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="text-lg mr-2">🖥️</span>
                    Platforms
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {tool.platforms.map(platform => (
                      <span 
                        key={platform}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100"
                        data-testid={`level-4-platform-${platform.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        {platform}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Complexity */}
              {tool.complexity && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="text-lg mr-2">📊</span>
                    Difficulty
                  </h4>
                  <div className="space-y-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${complexityInfo.color}`} data-testid="level-4-complexity-badge">
                      <span className="mr-1">{complexityInfo.icon}</span>
                      {complexityInfo.label}
                    </span>
                    <p className="text-xs text-gray-600">{complexityInfo.description}</p>
                  </div>
                </div>
              )}

              {/* License */}
              {tool.license && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="text-lg mr-2">📄</span>
                    License
                  </h4>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-700 border border-gray-100" data-testid="level-4-license-badge">
                    {tool.license}
                  </span>
                </div>
              )}

              {/* Popular Badge */}
              {tool.popular && (
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-6 shadow-sm border border-orange-100">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="text-lg mr-2">⭐</span>
                    Status
                  </h4>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200" data-testid="level-4-popular-badge">
                    🔥 Popular Choice
                  </span>
                </div>
              )}
            </div>

            {/* Installation */}
            {tool['Install Command'] && (
              <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-lg">
                <div className="px-6 py-4 bg-gray-800 border-b border-gray-700">
                  <h3 className="text-lg font-semibold text-white flex items-center">
                    <span className="text-2xl mr-3">⚡</span>
                    Quick Install
                  </h3>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between bg-gray-800 rounded-lg p-4">
                    <code className="text-green-400 font-mono text-sm flex-1 break-all" data-testid="level-4-install-command">
                      {tool['Install Command']}
                    </code>
                    <motion.button
                      onClick={() => copyToClipboard(tool['Install Command'], 'install')}
                      className="ml-4 p-2 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors duration-200 rounded-lg"
                      title="Copy to clipboard"
                      data-testid="level-4-copy-install-button"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {copiedField === 'install' ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="text-green-400"
                        >
                          ✓
                        </motion.div>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      )}
                    </motion.button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )

      case 'case-study':
        return (
          <motion.div 
            className="space-y-6"
            data-testid="level-4-case-study-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <span className="text-2xl mr-3">📊</span>
                  Real-World Case Study
                </h3>
              </div>
              <div className="p-6">
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {tool['Case Study']}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )

      case 'samples':
        return (
          <motion.div 
            className="space-y-6"
            data-testid="level-4-samples-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-lg">
              <div className="px-6 py-4 bg-gray-800 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white flex items-center">
                    <span className="text-2xl mr-3">💻</span>
                    Code Examples
                  </h3>
                  <motion.button
                    onClick={() => copyToClipboard(tool.Samples, 'samples')}
                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors duration-200 rounded-lg"
                    title="Copy code"
                    data-testid="level-4-copy-samples-button"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {copiedField === 'samples' ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-green-400"
                      >
                        ✓
                      </motion.div>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )}
                  </motion.button>
                </div>
              </div>
              <div className="p-6">
                <pre className="text-green-400 font-mono text-sm overflow-x-auto whitespace-pre-wrap leading-relaxed" data-testid="level-4-code-samples">
                  <code>{tool.Samples}</code>
                </pre>
              </div>
            </div>
          </motion.div>
        )

      case 'comparison':
        return (
          <motion.div 
            className="space-y-6"
            data-testid="level-4-comparison-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-yellow-50 to-amber-50 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <span className="text-2xl mr-3">⚖️</span>
                  Comparison Analysis
                </h3>
              </div>
              <div className="p-6">
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {tool.Comparison}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )

      case 'benefits':
        return (
          <motion.div 
            className="space-y-6"
            data-testid="level-4-benefits-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <span className="text-2xl mr-3">✨</span>
                  Key Benefits
                </h3>
              </div>
              <div className="p-6">
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {tool.Benefits}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )

      case 'resources':
        return (
          <motion.div 
            className="space-y-6"
            data-testid="level-4-resources-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-purple-50 to-violet-50 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <span className="text-2xl mr-3">📚</span>
                  Documentation & Resources
                </h3>
              </div>
              <div className="p-6">
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 text-base mb-2">Official Documentation</h4>
                      <p className="text-gray-600 text-sm">Complete guides, API references, and tutorials</p>
                    </div>
                    <motion.a
                      href={tool['Reference Docs']}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white text-sm font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                      data-testid="level-4-docs-link"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span>View Documentation</span>
                      <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </motion.a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )

      default:
        return null
    }
  }

  return (
    <div id="level-4-detail" className={`py-20 bg-gradient-to-br from-white via-purple-50/30 to-violet-50/20 ${className}`} {...props}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <BackButton 
              onClick={onBack}
              label="Back to Tools"
              className="group inline-flex items-center space-x-3 px-6 py-3 bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl text-gray-700 hover:text-purple-700 hover:bg-white/90 hover:border-purple-200/60 font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1"
            />
          </motion.div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/60 p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center space-x-6 mb-6 lg:mb-0">
                <div className="text-5xl flex-shrink-0 p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl shadow-inner">
                  {tool.icon || '🔧'}
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 via-purple-700 to-violet-700 bg-clip-text text-transparent mb-3">
                    {tool.label}
                  </h1>
                  <div className="flex items-center space-x-3">
                    {tool.popular && (
                      <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-orange-100 to-amber-100 text-orange-800 border border-orange-200/60 shadow-sm">
                        🔥 Popular
                      </span>
                    )}
                    {selectedCategory && (
                      <span 
                        className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium shadow-sm border"
                        style={{ 
                          backgroundColor: `${selectedCategory.color || '#8B5CF6'}15`,
                          color: selectedCategory.color || '#8B5CF6',
                          borderColor: `${selectedCategory.color || '#8B5CF6'}30`
                        }}
                      >
                        {selectedCategory.label}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Enhanced Action Buttons */}
              <div className="flex items-center space-x-3">
                <motion.button
                  onClick={() => onToggleCompare?.(tool)}
                  className={`
                    group px-6 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm border
                    ${isComparing 
                      ? 'bg-gradient-to-r from-purple-500 to-violet-500 text-white border-purple-200/60 hover:from-purple-600 hover:to-violet-600' 
                      : 'bg-white/80 text-gray-700 border-gray-200/60 hover:bg-white/90 hover:text-purple-700 hover:border-purple-300'
                    }
                  `}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="flex items-center space-x-2">
                    {isComparing ? (
                      <>
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>Comparing</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span>Compare</span>
                      </>
                    )}
                  </span>
                </motion.button>
                
                <motion.button
                  onClick={() => onBookmark?.(tool)}
                  className="group p-3 text-gray-600 hover:text-purple-700 hover:bg-white/90 hover:border-purple-200/60 bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                  title="Bookmark"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </motion.button>
                
                <motion.button
                  onClick={() => onShare?.(tool)}
                  className="group p-3 text-gray-600 hover:text-purple-700 hover:bg-white/90 hover:border-purple-200/60 bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                  title="Share"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                </motion.button>
                
                <motion.button
                  onClick={() => onPrint?.(tool)}
                  className="group p-3 text-gray-600 hover:text-purple-700 hover:bg-white/90 hover:border-purple-200/60 bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                  title="Print"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Tab Navigation */}
        <motion.div 
          className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/60 mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <nav className="flex space-x-1 p-2 bg-gradient-to-r from-purple-50/80 to-violet-50/80 rounded-2xl">
            {tabs.map(tab => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex-1 py-3 px-4 rounded-xl font-medium text-sm transition-all duration-300 whitespace-nowrap
                  ${activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-500 to-violet-500 text-white shadow-lg'
                    : 'text-gray-600 hover:text-purple-700 hover:bg-white/80 hover:shadow-md'
                  }
                `}
                whileHover={{ scale: activeTab !== tab.id ? 1.02 : 1 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="flex items-center justify-center space-x-2">
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </span>
              </motion.button>
            ))}
          </nav>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

Level4ToolDetail.propTypes = {
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
  }),
  selectedCategory: PropTypes.object,
  isComparing: PropTypes.bool,
  onToggleCompare: PropTypes.func,
  onBack: PropTypes.func.isRequired,
  onBookmark: PropTypes.func,
  onShare: PropTypes.func,
  onPrint: PropTypes.func,
  className: PropTypes.string,
}

export default Level4ToolDetail