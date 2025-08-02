import React from 'react'
import PropTypes from 'prop-types'
import styles from './LoadingSpinner.module.css'

const LoadingSpinner = ({ size = 'medium', message = 'Loading...', className = '' }) => {
  return (
    <div className={`${styles.container} ${className}`}>
      <div className={`${styles.spinner} ${styles[size]}`}>
        <div className={styles.circle}></div>
        <div className={styles.circle}></div>
        <div className={styles.circle}></div>
        <div className={styles.circle}></div>
      </div>
      {message && <p className={styles.message}>{message}</p>}
    </div>
  )
}

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  message: PropTypes.string,
  className: PropTypes.string,
}

export default LoadingSpinner
