
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
    <ul className={styles.navList}>
      <li><Link to="/" className={styles.navLink} onClick={() => setDrawerOpen(false)}>Home</Link></li>
      <li><Link to="/about" className={styles.navLink} onClick={() => setDrawerOpen(false)}>About</Link></li>
      <li><Link to="/contact" className={styles.navLink} onClick={() => setDrawerOpen(false)}>Contact</Link></li>
      <li><Link to="/dashboard" className={styles.navLink} onClick={() => setDrawerOpen(false)}>Dashboard</Link></li>
    </ul>
  )

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link to="/" className={styles.logoLink}>
            Future of QE
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className={styles.nav}>
          {renderNavLinks()}
        </nav>

        <div className={styles.actions}>


          {/* Hamburger icon for mobile */}
          <button
            onClick={() => setDrawerOpen(true)}
            className={`${styles.hamburger} ${styles.hiddenDesktop}`}
            aria-label="Open menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      {/* Side Drawer for mobile */}
      {drawerOpen && (
        <div className={styles.sideDrawerOverlay} onClick={() => setDrawerOpen(false)}>
          <nav
            className={styles.sideDrawer}
            onClick={e => e.stopPropagation()}
            role="navigation"
            aria-label="Mobile menu"
          >
            <button
              onClick={() => setDrawerOpen(false)}
              className={styles.closeDrawer}
              aria-label="Close menu"
            >
              ×
            </button>
            {renderNavLinks()}
            <div className={styles.drawerActions}></div>
          </nav>
        </div>
      )}
    </header>
  )
}

export default Header
