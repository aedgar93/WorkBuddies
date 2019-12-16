import React from 'react'
import styles from './SetUpEmployees.module.css'
import Invites from '../../shared/invites'
import Button from 'react-bootstrap/Button'
import { ROUTES } from '../../utils/constants'

const SetUpEmployees = ({history}) => {
  const handleDone = () => {
    history.push(ROUTES.BASE)
  }

  return (
    <div className={styles.wrapper}>
      <h3>Almost Done!</h3>
      <div className={styles.desc}>
        Add some coworkers to send them an invite email.
      </div>
      <div className={styles.invites}>
        <Invites />
      </div>
      <div className={styles.doneButton}>
        <Button size="lg" onClick={handleDone}>Done</Button>
      </div>
    </div>
  )
}

export default SetUpEmployees
