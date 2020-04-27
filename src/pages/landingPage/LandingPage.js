// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import styles from './LandingPage.module.css'
import SampleActivities from '../../shared/sampleActivities/SampleActivities';
import { ROUTES } from '../../utils/constants'
import { Button } from 'react-bootstrap'
import bg1 from '../../assets/images/landing_bg_1.png'
import bg2 from '../../assets/images/landing_bg_2.png'
import time from '../../assets/images/time.svg'
import money from '../../assets/images/money.svg'
import hands from '../../assets/images/hands.svg'




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

        <div className={styles.blurb}>
          <div className={styles.icon} style={{width: '30px', height: '30px'}}>
            <img src={time} alt="Clock" />
          </div>
          <div className={styles.info}>
            Each week co-workers are paired up to do something around the office. <br/>
            <strong>All you need is 10 minutes.</strong>
          </div>
        </div>
        <div className={styles.blurb}>
          <div className={styles.icon} style={{width: '33px', height: '30px'}}>
            <img src={money} alt="Dollar Bill" />
          </div>
          <div className={styles.info}>
            <strong>No more expensive</strong> team building workshops, get to know each other one-on-one.
          </div>
        </div>
        <div className={styles.blurb}>
          <div className={styles.icon} style={{width: '50px', height: '27px'}}>
            <img src={hands} alt="Hands forming a heart" />
          </div>
          <div className={styles.info}>
            Keep it small and <strong>build better relationships</strong> within your team, or invite the whole office and break down barriers between teams.
          </div>
        </div>
      </div>
    </>
  );
}

export default LandingPage
