import React from 'react'
import styles from './UserCard.module.css'

const UserCard = ({ firstName, lastName, email, slack }) => {

  return (
    <div className={styles.card}>
      <div className={styles.imgContainer}>

      </div>
      <div className={styles.info}>
          <div className={styles.name}>{firstName} {lastName}</div>
          { email ? <div className={styles.contact}><i className="la la-envelope"></i><span className={styles.detail}>{email}</span></div> : null}
          { slack ? <div className={styles.contact}><i className="la la-comment-dots"></i><span className={styles.detail}>Slack: {slack}</span></div> : null}
      </div>
    </div>
  )

}

export default UserCard
