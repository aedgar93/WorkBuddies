import React from 'react'
import styles from './UserCard.module.css'
import ProfilePic from '../profilePic'

const UserCard = ({ user }) => {

  return (
    <div className={styles.card}>
      <ProfilePic user={user} size={75}/>
      <div className={styles.info}>
          <div className={styles.name}>{user.firstName} {user.lastName}</div>
          { user.email ? <div className={styles.contact}><i className="la la-envelope"></i><a className={styles.detail} href={`mailto:${user.email}`}>{user.email}</a></div> : null}
          { user.slack ? <div className={styles.contact}><i className="la la-comment-dots"></i><span className={styles.detail}>Slack: {user.slack}</span></div> : null}
      </div>
    </div>
  )

}

export default UserCard
