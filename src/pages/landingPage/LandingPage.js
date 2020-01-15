// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import styles from './LandingPage.module.css'
import SampleActivities from '../../shared/sampleActivities/SampleActivities';
import { ROUTES } from '../../utils/constants'
import Button from 'react-bootstrap/Button'

const LandingPage = ({ history }) => {
  let [selectedActivities, setSelectedActivities] = useState([])

  const next = () => {
    history.push({
      pathname: ROUTES.GET_STARTED,
      state: { selectedActivities }
    })
  }

  const signUp = () => {
    history.push(ROUTES.SIGN_UP)
  }

  return (
    <div className={styles.wrapper}>
      <h1>Work Buddies</h1>
      <h2>Slogan/Description</h2>

      <div>Select some activities in your office to get started.</div>
      <div className={styles.sampleActivities}>
        <SampleActivities setSelectedActivities={setSelectedActivities} selectedActivities={selectedActivities}/>
      </div>
      <div className={styles.actionsContainer}>
        <Button onClick={next}>Build a better team today</Button>
        <Button onClick={signUp}>I have an invite email</Button>
      </div>
    </div>
  );
}

export default LandingPage
