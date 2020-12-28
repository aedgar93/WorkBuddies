import React from 'react'
import styles from './SetUpEmployees.module.css'
import SendInvites from '../../shared/sendInvites'
import { ROUTES } from 'wb-utils/constants'
import icons from '../../assets/images/people_icons.svg'

const SetUpEmployees = ({history}) => {

  const handleDone = () => {
    history.push(ROUTES.BASE, {showInviteAlert: true})
  }


  const skip = () => {
    history.push(ROUTES.BASE)
  }

  return (
    <div className={styles.outerWrapper}>
      <img src={icons} alt="Outlines of faces" className={styles.icons}/>
      <div className={styles.wrapper}>
        <h2 className={styles.title}>Let's invite your work buddies</h2>
        <SendInvites onNext={skip} onSubmit={handleDone}/>
      </div>
    </div>
  )
}

export default SetUpEmployees
