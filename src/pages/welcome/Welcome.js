// eslint-disable-next-line no-unused-vars
import React from 'react';
import Button from 'react-bootstrap/Button'
import styles from './Welcome.module.css'
import { ROUTES } from '../../utils/constants'

const Welcome = ({ history}) => {

  const goToInvites = () => {
    history.push(ROUTES.SET_UP_EMPLOYEES)
  }

  return (
    <div className={styles.container}>
      <h2>Welcome, [name]</h2>
      <div className={styles.infoContainer}>
        <ol>
          <li>
            Every <span className={styles.emphasis}>Monday</span> you will be paired up with someone from your office.
          </li>
          <li>
            We will randomly assign you an <span className={styles.emphasis}>activity.</span>
          </li>
          <li>
            Talk to your buddy and find a time to complete your activity
          </li>
        </ol>
      </div>
      <Button onClick={goToInvites}>Invite your work buddies</Button>
    </div>
  );
}

export default Welcome
