import React from 'react'
import { useResponsiveBreakpoint } from '../../hooks/useResponsive'
import styles from './ResponsiveDemo.module.css'

const ResponsiveDemo = () => {
  const { breakpoint, width, isMobile, isTablet, isDesktop } = useResponsiveBreakpoint()

  return (
    <div className={styles.demo} data-testid="responsive-demo-container">
      <h3 data-testid="responsive-demo-title">Current Viewport Information</h3>
      <div className={styles.info} data-testid="responsive-demo-info">
        <p><strong>Width:</strong> {width}px</p>
        <p><strong>Breakpoint:</strong> {breakpoint}</p>
        <p><strong>Device Type:</strong> {
          isMobile ? 'Mobile' : isTablet ? 'Tablet' : isDesktop ? 'Desktop' : 'Unknown'
        }</p>
      </div>
      
      <div className={styles.responsiveGrid} data-testid="responsive-demo-grid">
        <div className={styles.gridItem} data-testid="responsive-demo-grid-item-1">Item 1</div>
        <div className={styles.gridItem} data-testid="responsive-demo-grid-item-2">Item 2</div>
        <div className={styles.gridItem} data-testid="responsive-demo-grid-item-3">Item 3</div>
        <div className={styles.gridItem} data-testid="responsive-demo-grid-item-4">Item 4</div>
      </div>
      
      <p className={styles.hint} data-testid="responsive-demo-hint">
        Try resizing your browser window to see how the form adapts!
      </p>
    </div>
  )
}

export default ResponsiveDemo
