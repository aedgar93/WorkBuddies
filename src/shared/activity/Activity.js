import React from 'react'
import styles from './Activity.module.css'
import { ReactComponent as CloseIcon} from '../../assets/images/close_icon.svg'

const Activity = ({ name, onDelete }) => {
  return (
    <div className={styles.card}>
      <span className={styles.name}>{name}</span>
      { onDelete ? <div className={styles.closeContainer} onClick={onDelete}><CloseIcon className={styles.close}/></div> : null }
    </div>
  )
}

export default Activity
