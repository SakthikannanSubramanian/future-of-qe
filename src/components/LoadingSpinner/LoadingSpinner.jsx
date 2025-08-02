import React from 'react'
import PropTypes from 'prop-types'
import styles from './LoadingSpinner.module.css'

const LoadingSpinner = ({ size = 'medium', message = 'Loading...', className = '' }) => {
  return (
    <div className={`${styles.container} ${className}`} data-testid="loading-spinner-container">
      <div className={`${styles.spinner} ${styles[size]}`} data-testid="loading-spinner">
        <div className={styles.circle} data-testid="loading-spinner-circle-1"></div>
        <div className={styles.circle} data-testid="loading-spinner-circle-2"></div>
        <div className={styles.circle} data-testid="loading-spinner-circle-3"></div>
        <div className={styles.circle} data-testid="loading-spinner-circle-4"></div>
      </div>
      {message && <p className={styles.message} data-testid="loading-spinner-message">{message}</p>}
    </div>
  )
}

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  message: PropTypes.string,
  className: PropTypes.string,
}

export default LoadingSpinner
