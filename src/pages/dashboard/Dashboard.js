// eslint-disable-next-line no-unused-vars
import React from 'react';
import Matchup from '../../shared/matchup'
import styles from './Dashboard.module.css'

const Dashboard = () => {
  return (
    <div className={styles.wrapper}>
      <h2>Work Buddies</h2>
      <div className={styles.subtext}>Welcome to Work Buddies! Each week you wil be paired up with someone from your office. Talk to your buddy and find a time to complete your activity.</div>

      <div className={styles.section}>
        <h4>This Week!</h4>
        <div className={styles.matchup}>
          <Matchup />
        </div>

        <div className={styles.subtext}>Don't like the activity suggested? That's okay! You and your buddy can do whatever you'd like, as long as you spend a few minutes together this week. Take a look below to see other activities in your office.</div>
      </div>

      <div className={styles.section}>
        <h4>Office Activities</h4>
      </div>
    </div>
  )
}

export default Dashboard
