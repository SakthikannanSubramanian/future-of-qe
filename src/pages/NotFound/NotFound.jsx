import React from 'react'
import { Link } from 'react-router-dom'
import styles from './NotFound.module.css'

const NotFound = () => {
  return (
    <div className={styles.notFound}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>404</h1>
          <h2 className={styles.subtitle}>Page Not Found</h2>
          <p className={styles.description}>
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link to="/" className={styles.homeButton}>
            Go Back Home
          </Link>
        </div>
        <div className={styles.illustration}>
          🚫
        </div>
      </div>
    </div>
  )
}

export default NotFound
