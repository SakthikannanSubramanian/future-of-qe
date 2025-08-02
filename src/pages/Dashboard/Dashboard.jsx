import React from 'react'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../../redux/slices/userSlice'
import { useTheme } from '../../hooks/useTheme'
import Counter from '../../components/Counter/Counter'
import styles from './Dashboard.module.css'

const Dashboard = () => {
  const user = useSelector(selectCurrentUser)
  const { theme } = useTheme()

  if (!user) {
    return (
      <div className={styles.dashboard}>
        <div className={styles.container}>
          <h1>Please log in to access the dashboard</h1>
        </div>
      </div>
    )
  }

  return (
    <div className={`${styles.dashboard} ${styles[theme]}`}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1>Welcome back, {user.name}!</h1>
          <p>Here's your dashboard overview</p>
        </header>

        <div className={styles.grid}>
          <div className={styles.card}>
            <h3>Quick Stats</h3>
            <div className={styles.stats}>
              <div className={styles.stat}>
                <span className={styles.statNumber}>42</span>
                <span className={styles.statLabel}>Tests Passed</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>7</span>
                <span className={styles.statLabel}>Issues Found</span>
              </div>
            </div>
          </div>

          <div className={styles.card}>
            <h3>Interactive Counter</h3>
            <Counter />
          </div>

          <div className={styles.card}>
            <h3>Recent Activity</h3>
            <ul className={styles.activityList}>
              <li>✅ Test suite completed successfully</li>
              <li>🔧 Fixed critical bug in authentication</li>
              <li>📊 Generated performance report</li>
              <li>🚀 Deployed to staging environment</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
