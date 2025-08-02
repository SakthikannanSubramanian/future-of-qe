import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { selectTheme } from '../../redux/slices/uiSlice'

const ThemeProvider = ({ children }) => {
  const theme = useSelector(selectTheme)

  useEffect(() => {
    // Apply theme to body element
    document.body.className = 'theme-light'
    
    // Update CSS custom properties for global theme colors
    const root = document.documentElement
    
    if (theme === 'dark') {
      root.style.setProperty('--bg-primary', '#1a1a2e')
      root.style.setProperty('--bg-secondary', '#16213e')
      root.style.setProperty('--bg-tertiary', '#0f172a')
      root.style.setProperty('--text-primary', '#ffffff')
      root.style.setProperty('--text-secondary', '#e2e8f0')
      root.style.setProperty('--text-muted', '#94a3b8')
      root.style.setProperty('--border-color', '#334155')
      root.style.setProperty('--shadow-color', 'rgba(0, 0, 0, 0.3)')
    } else {
      root.style.setProperty('--bg-primary', '#ffffff')
      root.style.setProperty('--bg-secondary', '#f8fafc')
      root.style.setProperty('--bg-tertiary', '#f1f5f9')
      root.style.setProperty('--text-primary', '#1e293b')
      root.style.setProperty('--text-secondary', '#334155')
      root.style.setProperty('--text-muted', '#64748b')
      root.style.setProperty('--border-color', '#e2e8f0')
      root.style.setProperty('--shadow-color', 'rgba(0, 0, 0, 0.1)')
    }
  }, [theme])

  return <>{children}</>
}

export default ThemeProvider
