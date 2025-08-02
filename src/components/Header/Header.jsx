
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../../hooks/useTheme'
import styles from './Header.module.css'

const Header = () => {
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Close drawer on window resize if width > 768px
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && drawerOpen) {
        setDrawerOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [drawerOpen])

  const renderNavLinks = () => (
    <ul className={styles.navList} data-testid="header-nav-list">
      <li data-testid="header-nav-home"><Link to="/" className={styles.navLink} onClick={() => setDrawerOpen(false)} data-testid="header-nav-link-home">Home</Link></li>
      <li data-testid="header-nav-about"><Link to="/about" className={styles.navLink} onClick={() => setDrawerOpen(false)} data-testid="header-nav-link-about">About</Link></li>
      <li data-testid="header-nav-contact"><Link to="/contact" className={styles.navLink} onClick={() => setDrawerOpen(false)} data-testid="header-nav-link-contact">Contact</Link></li>
      <li data-testid="header-nav-dashboard"><Link to="/dashboard" className={styles.navLink} onClick={() => setDrawerOpen(false)} data-testid="header-nav-link-dashboard">Dashboard</Link></li>
    </ul>
  )

  return (
    <header className={styles.header} data-testid="header-root">
      <div className={styles.container} data-testid="header-container">
        <div className={styles.logo} data-testid="header-logo">
          <Link to="/" className={styles.logoLink} data-testid="header-logo-link">
            Future of QE
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className={styles.nav} data-testid="header-desktop-nav">
          {renderNavLinks()}
        </nav>

        <div className={styles.actions} data-testid="header-actions">
          {/* Hamburger icon for mobile */}
          <button
            onClick={() => setDrawerOpen(true)}
            className={`${styles.hamburger} ${styles.hiddenDesktop}`}
            aria-label="Open menu"
            data-testid="header-hamburger"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      {/* Side Drawer for mobile */}
      {drawerOpen && (
        <div className={styles.sideDrawerOverlay} onClick={() => setDrawerOpen(false)} data-testid="header-side-drawer-overlay">
          <nav
            className={styles.sideDrawer}
            onClick={e => e.stopPropagation()}
            role="navigation"
            aria-label="Mobile menu"
            data-testid="header-side-drawer"
          >
            <button
              onClick={() => setDrawerOpen(false)}
              className={styles.closeDrawer}
              aria-label="Close menu"
              data-testid="header-side-drawer-close"
            >
              ×
            </button>
            {renderNavLinks()}
            <div className={styles.drawerActions} data-testid="header-side-drawer-actions"></div>
          </nav>
        </div>
      )}
    </header>
  )
}

export default Header
