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
    { id: 'case-study', label: 'Case Study', icon: '📈', available: !!tool?.['Case Study'] },
    { id: 'samples', label: 'Code', icon: '⚡', available: !!tool?.['Samples'] },
    { id: 'comparison', label: 'Compare', icon: '🔍', available: !!tool?.['Comparison'] },
    { id: 'resources', label: 'Resources', icon: '🚀', available: !!tool?.['Reference Docs'] },
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

  const toolIcon = getToolIcon(tool?.Label || tool?.Tool || '', selectedCategory?.label || selectedCategory?.name || selectedCategory)

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

  // Scroll to the Tool Detail heading with offset on mount
  useEffect(() => {
    const heading = document.querySelector('[data-testid="level-4-tool-title"]');
    if (heading) {
      const offset = 120; // increased offset for icon visibility
      const y = heading.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, []);

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
              <div className="bg-gradient-to-br from-purple-50 to-violet-100 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-purple-100">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="text-3xl mr-4">💡</span>
                  What is it?
                </h3>
                <p className="text-gray-700 leading-relaxed text-lg">{tool['What is it?']}</p>
              </div>
            )}

            {/* Key Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Platforms */}
              {tool.platforms && tool.platforms.length > 0 && (
                <div className="bg-gradient-to-br from-purple-50 to-violet-100 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-100">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="text-2xl mr-3">🖥️</span>
                    Platforms
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {tool.platforms.map(platform => (
                      <span 
                        key={platform}
                        className="inline-flex items-center px-3 py-2 rounded-xl text-sm font-medium bg-purple-100 text-purple-800 border border-purple-200"
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
                <div className="bg-gradient-to-br from-purple-50 to-violet-100 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-100">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="text-2xl mr-3">📊</span>
                    Difficulty
                  </h4>
                  <div className="space-y-3">
                    <span className={`inline-flex items-center px-3 py-2 rounded-xl text-sm font-medium border ${complexityInfo.color}`} data-testid="level-4-complexity-badge">
                      <span className="mr-2">{complexityInfo.icon}</span>
                      {complexityInfo.label}
                    </span>
                    <p className="text-sm text-gray-600">{complexityInfo.description}</p>
                  </div>
                </div>
              )}

              {/* License */}
              {tool.license && (
                <div className="bg-gradient-to-br from-purple-50 to-violet-100 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-100">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="text-2xl mr-3">📄</span>
                    License
                  </h4>
                  <span className="inline-flex items-center px-3 py-2 rounded-xl text-sm font-medium bg-gray-100 text-gray-800 border border-gray-200" data-testid="level-4-license-badge">
                    {tool.license}
                  </span>
                </div>
              )}

              {/* Popular Badge */}
              {tool.popular && (
                <div className="bg-gradient-to-br from-orange-100 to-amber-100 rounded-2xl p-6 shadow-lg border border-orange-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="text-2xl mr-3">⭐</span>
                    Status
                  </h4>
                  <span className="inline-flex items-center px-3 py-2 rounded-xl text-sm font-medium bg-orange-200 text-orange-900 border border-orange-300" data-testid="level-4-popular-badge">
                    🔥 Popular Choice
                  </span>
                </div>
              )}
            </div>

            {/* Installation */}
            {tool['Install Command'] && (
              <div className="bg-gradient-to-br from-purple-100 to-violet-100 rounded-3xl overflow-hidden shadow-xl">
                <div className="px-8 py-6 bg-gradient-to-r from-purple-200 to-violet-200 border-b border-purple-200">
                  <h3 className="text-xl font-semibold text-purple-900 flex items-center">
                    <span className="text-3xl mr-4">⚡</span>
                    Quick Install
                  </h3>
                </div>
                <div className="p-8">
                  <div className="flex items-center justify-between bg-white/80 rounded-xl p-6 border border-purple-100">
                    <code className="text-purple-700 font-mono text-lg flex-1 break-all" data-testid="level-4-install-command">
                      {tool['Install Command']}
                    </code>
                    <motion.button
                      onClick={() => copyToClipboard(tool['Install Command'], 'install')}
                      className="ml-6 p-3 text-purple-400 hover:text-purple-700 hover:bg-purple-100 transition-colors duration-200 rounded-xl"
                      title="Copy to clipboard"
                      data-testid="level-4-copy-install-button"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {copiedField === 'install' ? (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="text-green-400 text-xl"
                        >
                          ✓
                        </motion.span>
                      ) : (
                        <span className="text-xl">📋</span>
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
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
              <div className="px-8 py-6 bg-gradient-to-r from-purple-100 to-violet-100 border-b border-purple-200">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                  <span className="text-3xl mr-4">📈</span>
                  Real-World Case Study
                </h3>
              </div>
              <div className="p-8">
                <div className="prose prose-lg prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line text-lg">
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
            <div className="bg-gradient-to-br from-purple-100 to-violet-100 rounded-3xl overflow-hidden shadow-xl">
              <div className="px-8 py-6 bg-gradient-to-r from-purple-200 to-violet-200 border-b border-purple-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-purple-900 flex items-center">
                    <span className="text-3xl mr-4">⚡</span>
                    Code Examples
                  </h3>
                  <motion.button
                    onClick={() => copyToClipboard(tool.Samples, 'samples')}
                    className="p-3 text-purple-400 hover:text-purple-700 hover:bg-purple-100 transition-colors duration-200 rounded-xl"
                    title="Copy code"
                    data-testid="level-4-copy-samples-button"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {copiedField === 'samples' ? (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-green-400 text-xl"
                      >
                        ✓
                      </motion.span>
                    ) : (
                      <span className="text-xl">📋</span>
                    )}
                  </motion.button>
                </div>
              </div>
              <div className="p-8">
                <pre className="text-purple-700 font-mono text-base overflow-x-auto whitespace-pre-wrap leading-relaxed" data-testid="level-4-code-samples">
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
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
              <div className="px-8 py-6 bg-gradient-to-r from-amber-100 to-orange-100 border-b border-amber-200">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                  <span className="text-3xl mr-4">🔍</span>
                  Comparison Analysis
                </h3>
              </div>
              <div className="p-8">
                <div className="prose prose-lg prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line text-lg">
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
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
              <div className="px-8 py-6 bg-gradient-to-r from-green-100 to-emerald-100 border-b border-green-200">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                  <span className="text-3xl mr-4">💎</span>
                  Key Benefits
                </h3>
              </div>
              <div className="p-8">
                <div className="prose prose-lg prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line text-lg">
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
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
              <div className="px-8 py-6 bg-gradient-to-r from-purple-100 to-indigo-100 border-b border-purple-200">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                  <span className="text-3xl mr-4">🚀</span>
                  Documentation & Resources
                </h3>
              </div>
              <div className="p-8">
                <div className="prose prose-lg prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line text-lg">
                    {tool['Reference Docs']}
                  </p>
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
  <motion.div
    id="level-4-detail"
    className={`min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-violet-50 ${className}`}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.6 }}
    data-testid="level-4-tool-detail"
    {...props}
  >
    {/* Modern Header with Glass Morphism */}
    <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-purple-100 shadow-sm" data-testid="level-4-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Title Section */}
          <div className="flex items-center space-x-4">
            <BackButton 
              onClick={onBack} 
              className="flex-shrink-0 bg-white/90 backdrop-blur-sm border border-gray-200/60 rounded-xl text-gray-700 hover:text-purple-700 hover:bg-white hover:border-purple-200/60 font-medium shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
              data-testid="level-4-back-button"
            />
            <div className="flex items-center space-x-4">
                <motion.div 
                  className="w-16 h-16 bg-gradient-to-br from-purple-400 to-violet-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  data-testid="level-4-tool-icon"
                >
                {toolIcon}
              </motion.div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-700 to-violet-700 bg-clip-text text-transparent" data-testid="level-4-tool-title">
                  {tool.Label || tool.Tool || 'Tool Detail'}
                </h1>
                <p className="text-gray-600 text-sm sm:text-base font-medium" data-testid="level-4-tool-category">
                  {selectedCategory?.label || selectedCategory?.name || selectedCategory || 'Category'}
                </p>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            {onToggleCompare && (
              <motion.button
                onClick={() => onToggleCompare(tool)}
                className={`px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300 ${
                  isComparing
                    ? 'bg-gradient-to-r from-purple-500 to-violet-600 text-white shadow-lg hover:shadow-xl'
                    : 'bg-white/90 text-gray-700 border border-purple-200 hover:bg-purple-50 hover:border-purple-300'
                }`}
                data-testid="level-4-compare-toggle"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isComparing ? '✓ Added' : '+ Compare'}
              </motion.button>
            )}
            <motion.button
              onClick={() => onBookmark?.(tool)}
              className="p-3 bg-white/90 text-gray-700 border border-purple-200 rounded-xl hover:bg-purple-50 hover:border-purple-300 hover:text-purple-600 transition-all duration-300"
              data-testid="level-4-bookmark-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              📌
            </motion.button>
          </div>
        </div>
      </div>
    </div>

    {/* Main Content Container */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-testid="level-4-main-content">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar - Actions */}
        <div className="lg:col-span-1 space-y-6" data-testid="level-4-sidebar">
          {/* Quick Install Card */}
          {tool['Install Command'] && (
            <motion.div 
            className="bg-gradient-to-br from-purple-100 to-violet-100 rounded-3xl overflow-hidden shadow-xl border border-purple-100"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            data-testid="level-4-install-section"
          >
            <div className="px-6 py-4 bg-gradient-to-r from-purple-200 to-violet-200">
              <h3 className="text-lg font-semibold text-purple-900 flex items-center">
                <span className="text-2xl mr-3">⚡</span>
                Quick Install
              </h3>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between bg-white/80 rounded-xl p-4 border border-purple-100">
                <code className="text-purple-700 font-mono text-sm flex-1 break-all" data-testid="level-4-install-command">
                  {tool['Install Command']}
                </code>
                <motion.button
                  onClick={() => copyToClipboard(tool['Install Command'], 'install')}
                  className="ml-3 p-2 text-purple-400 hover:text-purple-700 hover:bg-purple-100 transition-colors duration-200 rounded-lg"
                  title="Copy to clipboard"
                  data-testid="level-4-copy-install-button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {copiedField === 'install' ? (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-green-400 text-lg"
                    >
                      ✓
                    </motion.span>
                  ) : (
                    <span className="text-lg">📋</span>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3" data-testid="level-4-content-area">
          {/* Modern Tab Navigation */}
          <motion.div 
            className="bg-gradient-to-br from-purple-50 to-violet-100 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-purple-100 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            data-testid="level-4-tab-navigation"
          >
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-white/60 hover:text-purple-600'
                  }`}
                  data-testid={`level-4-tab-${tab.id}`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="mr-2 text-lg">{tab.icon}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              data-testid="level-4-tab-content"
            >
              {renderTabContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  </motion.div>
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
    'Benefits': PropTypes.string,
  }),
  selectedCategory: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      label: PropTypes.string,
      name: PropTypes.string,
      id: PropTypes.string,
    })
  ]),
  isComparing: PropTypes.bool,
  onToggleCompare: PropTypes.func,
  onBack: PropTypes.func.isRequired,
  onBookmark: PropTypes.func,
  onShare: PropTypes.func,
  onPrint: PropTypes.func,
  className: PropTypes.string,
}

export default Level4ToolDetail
