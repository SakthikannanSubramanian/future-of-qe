import React from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../../hooks/useTheme'
import styles from './Home.module.css'

const Home = () => {
  const { theme } = useTheme()

  return (
    <div className={`${styles.home} ${styles[theme]}`}>
      <div className={styles.container}>
        {/* Header displayed in the center of the page */}
        <header className={styles.landingHeader}>
          <h1 className={styles.mainTitle}>
            Future of QE Platform
          </h1>
        </header>

        {/* Description displayed below the header */}
        <section className={styles.description}>
          <p className={styles.descriptionText}>
            Welcome to the comprehensive Quality Engineering platform that streamlines 
            your testing workflow. Navigate through project details, explore technology 
            stacks, and monitor your progress with our intuitive dashboard.
          </p>
        </section>

        {/* 3 Navigation Icons */}
        <section className={styles.navigation}>
          <div className={styles.navigationGrid}>
            <Link to="/pre-questionnaire" className={styles.navigationCard} aria-label="Question Screen">
              <div className={styles.navigationIcon}>
                <span className={styles.iconSymbol}>❓</span>
              </div>
              <h3 className={styles.navigationLabel}>Question Screen</h3>
              <p className={styles.navigationDescription}>
                Access project details and questionnaire
              </p>
            </Link>

            <Link to="/tech-stack" className={styles.navigationCard} aria-label="Tech Stack">
              <div className={styles.navigationIcon}>
                <span className={styles.iconSymbol}>⚙️</span>
              </div>
              <h3 className={styles.navigationLabel}>Tech Stack</h3>
              <p className={styles.navigationDescription}>
                Explore technology stack options
              </p>
            </Link>

            <Link to="/dashboard" className={styles.navigationCard} aria-label="Dashboard Screen">
              <div className={styles.navigationIcon}>
                <span className={styles.iconSymbol}>📊</span>
              </div>
              <h3 className={styles.navigationLabel}>Dashboard Screen</h3>
              <p className={styles.navigationDescription}>
                Monitor progress and analytics
              </p>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Home
