// eslint-disable-next-line no-unused-vars
import React from 'react';
import Matchup from '../../shared/matchup'
import styles from './Dashboard.module.css'

const Dashboard = () => {
  return (
    <div className={styles.wrapper}>
      <Matchup />
    </div>
  )
}

export default Dashboard
