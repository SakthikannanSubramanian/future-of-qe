import { useState, useEffect } from 'react'

// Hook to get current viewport size
export const useViewportSize = () => {
  const [viewport, setViewport] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768
  })

  useEffect(() => {
    const handleResize = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return viewport
}

// Hook to get responsive breakpoint
export const useResponsiveBreakpoint = () => {
  const { width } = useViewportSize()

  const getBreakpoint = (width) => {
    if (width < 320) return 'xs'
    if (width < 480) return 'sm'
    if (width < 768) return 'md'
    if (width < 1024) return 'lg'
    if (width < 1200) return 'xl'
    return 'xxl'
  }

  return {
    breakpoint: getBreakpoint(width),
    isMobile: width < 768,
    isTablet: width >= 768 && width < 1024,
    isDesktop: width >= 1024,
    width
  }
}

// Hook for responsive form behavior
export const useResponsiveForm = () => {
  const { breakpoint, isMobile, isTablet } = useResponsiveBreakpoint()

  const getFormConfig = () => {
    switch (breakpoint) {
      case 'xs':
      case 'sm':
        return {
          inputPadding: '0.75rem',
          fontSize: '0.9rem',
          buttonWidth: '100%',
          gridColumns: 1,
          spacing: '1rem'
        }
      case 'md':
        return {
          inputPadding: '0.875rem',
          fontSize: '1rem',
          buttonWidth: '100%',
          gridColumns: 1,
          spacing: '1.5rem'
        }
      case 'lg':
        return {
          inputPadding: '0.875rem',
          fontSize: '1rem',
          buttonWidth: 'auto',
          gridColumns: 2,
          spacing: '2rem'
        }
      default:
        return {
          inputPadding: '0.75rem',
          fontSize: '1rem',
          buttonWidth: 'auto',
          gridColumns: 2,
          spacing: '2rem'
        }
    }
  }

  return {
    ...getFormConfig(),
    breakpoint,
    isMobile,
    isTablet
  }
}
