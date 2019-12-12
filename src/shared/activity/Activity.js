import React from 'react'
import styles from './Activity.module.css'

const Activity = ({ name, icon, onClick, selected }) => {
  return (
    <div className={[styles.card, selected ? styles.selected : ""].join(" ")} onClick={() => { if(onClick) onClick() }}>
      <div className={styles.iconContainer}>
        { icon ? <img className={styles.icon} src={icon} alt="Activity Icon"/> : null }
      </div>
      <span className={styles.name}>{name}</span>
    </div>
  )
}

export default Activity
