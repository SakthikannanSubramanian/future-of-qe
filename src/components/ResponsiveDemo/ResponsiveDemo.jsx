import React from 'react'
import { useResponsiveBreakpoint } from '../../hooks/useResponsive'
import styles from './ResponsiveDemo.module.css'

const ResponsiveDemo = () => {
  const { breakpoint, width, isMobile, isTablet, isDesktop } = useResponsiveBreakpoint()

  return (
    <div className={styles.demo}>
      <h3>Current Viewport Information</h3>
      <div className={styles.info}>
        <p><strong>Width:</strong> {width}px</p>
        <p><strong>Breakpoint:</strong> {breakpoint}</p>
        <p><strong>Device Type:</strong> {
          isMobile ? 'Mobile' : isTablet ? 'Tablet' : isDesktop ? 'Desktop' : 'Unknown'
        }</p>
      </div>
      
      <div className={styles.responsiveGrid}>
        <div className={styles.gridItem}>Item 1</div>
        <div className={styles.gridItem}>Item 2</div>
        <div className={styles.gridItem}>Item 3</div>
        <div className={styles.gridItem}>Item 4</div>
      </div>
      
      <p className={styles.hint}>
        Try resizing your browser window to see how the form adapts!
      </p>
    </div>
  )
}

export default ResponsiveDemo
