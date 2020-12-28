// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState, useContext } from 'react';
import { Button } from 'react-bootstrap'
import { AuthUserContext } from '../../session'
import styles from './Welcome.module.css'
import { ROUTES } from 'wb-utils/constants'
import bg_image from '../../assets/images/matchup_icons.svg'

const Welcome = ({ history }) => {
  const auth = useContext(AuthUserContext)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if(auth && auth.user) setLoading(false)
  }, [auth])

  const goToInvites = () => {
    history.push(ROUTES.SET_UP_EMPLOYEES)
  }

  if(loading) return ''
  return (
    <div className={styles.container}>
      <h2 className={styles.subTitle}>Welcome, {auth.user.firstName}</h2>
      <div className={styles.infoContainer}>
        <h2 className={styles.subTitle}>Start building better relationships with your team.</h2>
        <div className={styles.info}>
          Every week you will be paired up with someone from your office with a randomly assigned activity. Talk to your buddy and find a time to complete it!
        </div>
      </div>
      <Button onClick={goToInvites} size="lg">Invite your work buddies</Button>
      <img src={bg_image} alt="People pairing up to do activities" className={styles.icon}/>
    </div>
  );
}

export default Welcome
