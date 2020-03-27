import React from 'react'
import styles from './Activity.module.css'

const Activity = ({ name, onClick, selected }) => {
  return (
    <div className={[styles.card, selected ? styles.selected : ""].join(" ")} onClick={() => { if(onClick) onClick() }}>
      <span className={styles.name}>{name}</span>
    </div>
  )
}

export default Activity
