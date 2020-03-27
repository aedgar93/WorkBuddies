// eslint-disable-next-line no-unused-vars
import React, { useState, useContext, useEffect } from 'react';
import Matchup from '../../shared/matchup'
import styles from './Dashboard.module.css'
import Spinner from 'react-bootstrap/Spinner'
import { AuthUserContext } from '../../session'
import Activity from '../../shared/activity'

const Dashboard = () => {
  const [activities, setActivities] = useState([])
  const auth = useContext(AuthUserContext)

  useEffect(() => {
    if (auth.waitingForAuth) return
    let listener = auth.companyRef.collection('activities')
    .onSnapshot(snapshot => {
      let activities = []
      snapshot.forEach(doc => activities.push(doc.data()))
      setActivities(activities)
    })

    return function cleanup() {
      listener()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.waitingForAuth])

  if (auth.waitingForAuth) return <Spinner animation="border" size="lg" variant="primary"/>
  return (
    <div className={styles.wrapper}>
      <h2>Work Buddies</h2>
      <div className={styles.subtext}>Welcome to Work Buddies! Each week you wil be paired up with someone from your office. Talk to your buddy and find a time to complete your activity.</div>

      <div className={styles.section}>
        <h4>This Week!</h4>
        <div className={styles.matchup}>
          <Matchup />
        </div>

        <div className={styles.subtext}>Don't like the activity suggested? That's okay! You and your buddy can do whatever you'd like, as long as you spend a few minutes together this week. Take a look below to see other activities in your office.</div>
      </div>

      <div className={styles.section}>
        <h4>Office Activities</h4>
        {
          !activities ? <div className={styles.loading}><Spinner animation="border" size="lg" variant="primary"/></div> :
          <>
            {
            activities.length === 0 ?
              <div className={styles.subtext}>It looks like your admin hasn't added any activities for your office yet. Some of our favorite suggestions include grabbing a coffee, playing Ping Pong, or going for a walk.</div> :
              <div className={styles.activities}>
                {
                  activities.map((activity, index) => {
                    return <Activity key={activity.name + index} name={activity.name}/>
                  })
                }
              </div>
            }
          </>
        }
      </div>
    </div>
  )
}

export default Dashboard
