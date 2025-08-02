import React from 'react'
import styles from './About.module.css'

const About = () => {
  return (
    <div className={styles.about}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1>About Future of QE</h1>
          <p>Leading the evolution of Quality Engineering</p>
        </header>

        <section className={styles.content}>
          <div className={styles.section}>
            <h2>Our Mission</h2>
            <p>
              We're dedicated to transforming the landscape of Quality Engineering through 
              innovative tools, modern practices, and cutting-edge technology. Our platform 
              empowers teams to deliver high-quality software faster and more efficiently.
            </p>
          </div>

          <div className={styles.section}>
            <h2>Technology Stack</h2>
            <div className={styles.techGrid}>
              <div className={styles.techItem}>⚛️ React</div>
              <div className={styles.techItem}>🔄 Redux Toolkit</div>
              <div className={styles.techItem}>📱 Responsive Design</div>
              <div className={styles.techItem}>🧪 React Testing Library</div>
              <div className={styles.techItem}>🎨 CSS Modules</div>
              <div className={styles.techItem}>⚡ Vite</div>
            </div>
          </div>

          <div className={styles.section}>
            <h2>Key Features</h2>
            <ul className={styles.featureList}>
              <li>Modern React architecture with functional components</li>
              <li>State management with Redux Toolkit</li>
              <li>Fully responsive design for all devices</li>
              <li>Comprehensive unit testing setup</li>
              <li>CSS Modules for scoped styling</li>
              <li>Dark/Light theme support</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  )
}

export default About
