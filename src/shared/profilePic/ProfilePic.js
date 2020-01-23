// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import styles from './ProfilePic.module.css'

const ProfilePic = ({ onClick, children, user, size}) => {
  console.log(size)
  let [color, setColor] = useState(null)

  useEffect(() => {
    setColor(Math.floor(Math.random() * 3) + 1  )
  }, [])

  return (
    <div onClick={() => onClick && onClick()} className={styles.wrapper} data-color={color} data-size={size}>
      { user.profilePic ?
        <img src={user.profilePic} className={styles.pic} alt="Profile"/>
        :
        <div className={styles.initials}>
          {user.firstName[0]} {user.lastName[0]}
        </div>
      }
      { children }
    </div>
  );
}

export default ProfilePic
