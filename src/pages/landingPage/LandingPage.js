// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import styles from './LandingPage.module.css'
import SampleActivities from '../../shared/sampleActivities/SampleActivities';
import { ROUTES } from '../../utils/constants'
import Button from 'react-bootstrap/Button'
import bg1 from '../../assets/images/landing_bg_1.png'
import bg2 from '../../assets/images/landing_bg_2.png'


const LandingPage = ({ history }) => {
  let [selectedActivities, setSelectedActivities] = useState([])

  const next = () => {
    history.push({
      pathname: ROUTES.GET_STARTED,
      state: { selectedActivities }
    })
  }

  return (
    <>
      <div className={styles.topSection}>
        <img src={bg1} alt="People drinking coffee"  className={styles.bg1}/>
        <img src={bg2} alt="People eating lunch" className={styles.bg2}/>
        <div className={styles.topSectionInner}>
          <h1>Let's Bring Back the Water Cooler</h1>

          <div className={styles.activitiesContainer}>
            <div className={styles.instructions}>Pick a few activities available around your office to get started</div>
            <div className={styles.sampleActivities}>
              <SampleActivities setSelectedActivities={setSelectedActivities} selectedActivities={selectedActivities}/>
            </div>
          </div>
          <div className={styles.actionsContainer}>
            <Button onClick={next} className={styles.submit}>Build a better team today</Button>
            <br/>
            <a href={ROUTES.SIGN_UP} className={styles.link}>I have an invitation</a>
          </div>
        </div>

      </div>
      <div className={styles.bottomSection}>

      </div>
    </>
  );
}

export default LandingPage
