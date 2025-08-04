
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Modal from '../Modal/Modal';
import styles from './Header.module.css';


const Header = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modal, setModal] = useState(null); // 'contact' | 'about' | null
  const navigate = useNavigate();

  // Responsive drawer close on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && drawerOpen) setDrawerOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [drawerOpen]);

  // SVGs for logo and icons
  const cognizantLogo = (
    <img
      src="https://cognizant.scene7.com/is/content/cognizant/COG-Logo-2022-1?fmt=png-alpha"
      alt="Cognizant Logo"
      className={styles.cognizantLogoImg}
      data-testid="cognizant-logo-img"
    />
  );
  const envelopeIcon = (
    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#6366f1" strokeWidth="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>
  );
  const infoIcon = (
    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#6366f1" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
  );

  // Desktop nav links
  const renderNavLinks = (isMobile = false) => (
    <ul className={styles.navList} data-testid="header-nav-list">
      <li data-testid="header-nav-home">
        <button
          className={styles.navLink}
          style={{ background: 'none' }}
          onClick={() => { setDrawerOpen(false); navigate('/'); }}
          data-testid="header-nav-link-home"
        >
          {isMobile && <span style={{ marginRight: 8 }}><svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#6366f1" strokeWidth="2"><path d="M3 12L12 4l9 8"/><path d="M9 21V9h6v12"/></svg></span>}
          Home
        </button>
      </li>
      <li data-testid="header-nav-about">
        <button className={styles.navLink} style={{ background: 'none' }} onClick={() => { setModal('about'); setDrawerOpen(false); }} data-testid="header-nav-link-about">
          {isMobile && <span style={{ marginRight: 8 }}>{infoIcon}</span>}About
        </button>
      </li>
      <li data-testid="header-nav-contact">
        <button className={styles.navLink} style={{ background: 'none' }} onClick={() => { setModal('contact'); setDrawerOpen(false); }} data-testid="header-nav-link-contact">
          {isMobile && <span style={{ marginRight: 8 }}>{envelopeIcon}</span>}Contact Us
        </button>
      </li>
    </ul>
  );

  // Hamburger animation
  const [hamburgerActive, setHamburgerActive] = useState(false);
  useEffect(() => { setHamburgerActive(drawerOpen); }, [drawerOpen]);

  // Modal content
  const modalBg = { background: 'var(--bg-secondary, #f3f4f6)' };

  return (
    <header className={styles.header} data-testid="header-root" style={{ width: '100vw', left: 0, right: 0 }}>
      <div className={styles.container} data-testid="header-container">
        {/* Logo (left) */}
        <div className={styles.logo} data-testid="header-logo">
          <button className={styles.logoLink} onClick={() => navigate('/')} aria-label="Home" style={{ display: 'flex', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            {cognizantLogo}
          </button>
        </div>

        {/* Desktop Nav (right) */}
        <nav className={styles.nav} data-testid="header-desktop-nav" style={{ justifyContent: 'flex-end' }}>
          {renderNavLinks(false)}
        </nav>

        {/* Hamburger for mobile */}
        <div className={styles.actions} data-testid="header-actions">
          <button
            onClick={() => setDrawerOpen(true)}
            className={`${styles.hamburger} ${styles.hiddenDesktop} ${hamburgerActive ? styles.active : ''}`}
            aria-label="Open menu"
            data-testid="header-hamburger"
            style={{ outline: 'none', border: 'none', background: 'none', flexDirection: 'column', gap: 3, padding: 8 }}
          >
            <span style={{ height: 2, width: 22, background: '#333', borderRadius: 2, transition: 'all 0.3s', transform: hamburgerActive ? 'rotate(45deg) translateY(7px)' : 'none' }}></span>
            <span style={{ height: 2, width: 22, background: '#333', borderRadius: 2, transition: 'all 0.3s', opacity: hamburgerActive ? 0 : 1 }}></span>
            <span style={{ height: 2, width: 22, background: '#333', borderRadius: 2, transition: 'all 0.3s', transform: hamburgerActive ? 'rotate(-45deg) translateY(-7px)' : 'none' }}></span>
          </button>
        </div>
      </div>

      {/* Slide-out Drawer (mobile) */}
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
              style={{ fontSize: 28, color: '#6366f1', background: 'none', border: 'none', position: 'absolute', top: 18, right: 18, cursor: 'pointer' }}
            >
              ×
            </button>
            <div style={{ marginTop: 48 }}>
              {renderNavLinks(true)}
            </div>
          </nav>
        </div>
      )}

      {/* Modals */}
      <Modal isOpen={modal === 'contact'} onClose={() => { setModal(null); navigate('/'); }} overlayClassName={styles.modalOverlay} className={styles.modalContent}>
        <div style={{ ...modalBg, borderRadius: 16, padding: 24, minWidth: 260, textAlign: 'center', position: 'relative' }}>
          <button onClick={() => { setModal(null); navigate('/'); }} aria-label="Close" style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', fontSize: 24, color: '#6366f1', cursor: 'pointer' }}>×</button>
          <div style={{ fontSize: 22, fontWeight: 600, marginBottom: 8 }}>Contact Information</div>
          <div style={{ margin: '12px 0', fontSize: 16 }}>
            <b>Email:</b> <a href="mailto:sakthikannan.subramanian@cognizant.com" style={{ color: '#6366f1' }}>sakthikannan.subramanian@cognizant.com</a><br/>
            <b>Signature:</b> Sakthikannan Subramanian<br/>
            <span style={{ color: '#555', fontSize: 14, display: 'block', marginTop: 8 }}>Note: For any queries, please reach out to the above email address.</span>
          </div>
        </div>
      </Modal>
      <Modal isOpen={modal === 'about'} onClose={() => { setModal(null); navigate('/'); }} overlayClassName={styles.modalOverlay} className={styles.modalContent}>
        <div style={{ ...modalBg, borderRadius: 16, padding: 24, minWidth: 260, textAlign: 'center', position: 'relative' }}>
          <button onClick={() => { setModal(null); navigate('/'); }} aria-label="Close" style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', fontSize: 24, color: '#6366f1', cursor: 'pointer' }}>×</button>
          <div style={{ fontSize: 22, fontWeight: 600, marginBottom: 8 }}>About This Website</div>
          <div style={{ margin: '12px 0', fontSize: 16 }}>
            This website is designed to calculate the automation index score for a PNR project, providing actionable insights into automation maturity and progress.
          </div>
        </div>
      </Modal>
    </header>
  );
}

export default Header
