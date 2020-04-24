import React from 'react'
import styles from './Activity.module.css'
import { ReactComponent as CloseIcon} from '../../assets/images/close_icon.svg'

const Activity = ({ name, onDelete }) => {
  return (
    <div className={styles.card}>
      { onDelete ? <div className={styles.closeContainer} onClick={onDelete}><CloseIcon className={styles.close}/></div> : null }
      <span className={styles.name}>{name}</span>
    </div>
  )
}

export default Activity
