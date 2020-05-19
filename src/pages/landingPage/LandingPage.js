// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import { ROUTES } from 'wb-utils/constants'
import { Button } from 'react-bootstrap'
import styles from './LandingPage.module.css'
import landing1 from '../../assets/images/landing_1.svg'
import landing2 from '../../assets/images/landing_2.svg'
import landing3 from '../../assets/images/landing_3.svg'
import landing4 from '../../assets/images/landing_4.svg'
import logo from '../../assets/images/logo.svg'
import { Link } from 'react-router-dom';

const LandingPage = ({ history }) => {

  const next = () => {
    history.push({
      pathname: ROUTES.GET_STARTED
    })
  }

  return (
    <>
      <div className={styles.strip1}>
        <div className={styles.info}>
          <div className={styles.title}>Get to know your co-workers one activity at a time</div>
          <Button onClick={next} className={styles.startButton}>Get Started</Button>
          <br/>
          <Link to={ROUTES.ACCEPT_INVITE} className={styles.invite}>I have an invitation</Link>
        </div>
        <div className={styles.image1}><img src={landing1} alt="Two people walking while drinking coffee"/></div>
      </div>
      <div className={styles.strip2}>
        <div className={styles.image2}><img src={landing2} alt="Two people connected by a dotted link with names of activities listed in the background"/></div>
        <div className={styles.info}>
          <div className={styles.subTitle}>Build better relationships within your team.</div>
          <div className={styles.desc}>Every week you will be paired up with someone from your office with a randomly assign activity. Talk to your buddy and find a time to complete an activity!</div>
          <Button onClick={next} className={styles.startButton}>Get Started</Button>
        </div>
      </div>
      <div className={styles.strip3}>
        <div className={styles.image3}><img src={landing3} alt="A person working on their laptop"/></div>
        <div className={styles.info}>
          <div className={styles.subTitle}>Why Work Buddies?</div>
          <div>
            <div className={styles.infoBubble}>
              Help <strong>strengthen</strong> personal connections and company culture.
            </div>
            <div className={styles.infoBubble}>
              <strong>No more</strong> expensive team building workshops, get to know each other one-on-one.
            </div>
            <div className={styles.infoBubble}>
              Invite the whole office and <strong>break down barriers between teams.</strong>
            </div>
          </div>
        </div>
        <div className={styles.image4}><img src={landing4} alt="A person working on a computer"/></div>
      </div>
      <div className={styles.strip4}>
        <div className={styles.logo}><img src={logo} alt="Work Buddies Logo"/></div>
        <div className={styles.title2}>Get to know your co-workers one activity at a time</div>
        <Button onClick={next} className={styles.startButton}>Get Started</Button>
        <br/>
        <Link to={ROUTES.ACCEPT_INVITE} className={styles.invite}>I have an invitation</Link>
      </div>
    </>
  );
}

export default LandingPage
