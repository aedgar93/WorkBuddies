import React from 'react'
import styles from './SetUpEmployees.module.css'
import SendInvites from '../../shared/sendInvites'
import { ROUTES } from '../../utils/constants'

const SetUpEmployees = ({history}) => {

  const handleDone = () => {
    history.push(ROUTES.BASE)
  }


  const skip = () => {
    history.push(ROUTES.BASE)
  }

  return (
    <div className={styles.wrapper}>
      <h2>Let's invite your work buddies</h2>
      <SendInvites onNext={skip} onSubmit={handleDone}/>
    </div>
  )
}

export default SetUpEmployees
