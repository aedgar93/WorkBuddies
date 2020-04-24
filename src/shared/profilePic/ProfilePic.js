// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import styles from './ProfilePic.module.css'

const ProfilePic = ({ onClick, children, user, size}) => {

  let style = {}
  let initialsStyle = {}
  if(size && typeof size === 'number') {
    style.width = size
    style.height = size
    initialsStyle.lineHeight = size + 'px'
    initialsStyle.fontSize = size/2
    initialsStyle.letterSpacing = size/2 * .16 * -1 + 'px'
    initialsStyle.left = size/2 * .07 * -1 + 'px'
  }
  return (
    <>
      <div onClick={() => onClick && onClick()} className={`${styles.wrapper} ${onClick ? styles.clickable : null}`} data-size={size} style={style}>
        { user.profilePic ?
          <img src={user.profilePic} className={styles.pic} alt="Profile"/>
          :
          <div className={styles.initials} style={initialsStyle}>
            {user.firstName[0]} {user.lastName[0]}
          </div>
        }
      </div>
      <div onClick={() => onClick && onClick()}>{ children }</div>
    </>
  );
}

export default ProfilePic
