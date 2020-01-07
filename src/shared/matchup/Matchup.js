// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useContext } from 'react';
import moment from 'moment-timezone'
import Spinner from 'react-bootstrap/Spinner'
import styles from './Matchup.module.css'
import { AuthUserContext } from '../../session'
import { FirebaseContext } from '../../firebaseComponents'

const Matchup = () => {
  const [buddy, setBuddy] = useState(null)
  const [activity, setActivity] = useState(null)
  const [error, setError] = useState(null)
  const defaultErrorMessage = 'Oh no! Something went wrong.'
  const auth = useContext(AuthUserContext)
  const firebase = useContext(FirebaseContext)

  const getDate = () => {
    if(auth.company.matchUpTime) return moment(auth.company.matchUpTime).local().format('h a MMM Do')
    let now = moment().tz(auth.company.timeZone)
    let nextTime = moment().tz(auth.company.timeZone).isoWeekday(auth.company.day).hour(auth.company.hour).minute(0).second(0).milliseconds(0)
    if(now.isAfter(nextTime)) {
      nextTime = nextTime.add(1, 'weeks')
    }
    return nextTime.local().format('h a MMM Do')
  }
  useEffect(() => {
    async function fetchBuddies(){
      //Get your buddy
      let date = getDate()

      if(!auth.company.activeBuddies) {
        return setError(`Please check back at ${date} to find out who your weekly Buddy is!`)
      }
      let snapshot = await auth.companyRef.collection('buddies').doc(auth.company.activeBuddies).get()
      let matchup = snapshot.data().matchups.find(matchup => {
        return matchup.buddies.indexOf(auth.user.id) > -1
      })
      if(!matchup || matchup.buddies.length === 1) return setError(`Sorry, it looks like you haven't been matched up with a buddy this week. Please check back at ${date} to find out who your next weekly Buddy is!`)

      let buddyId = matchup.buddies.indexOf(auth.user.id) === 0 ? matchup.buddies[1] : matchup.buddies[0]
      let buddySnapshot = await firebase.db.collection('users').doc(buddyId).get()
      setBuddy(buddySnapshot.data())
      setActivity(matchup.activity)
    }
    fetchBuddies()
    .catch(() => setError(defaultErrorMessage))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if(error) return (<div>{error}</div>)
  if(!buddy) return (<div className={styles.loading}>Fetching this week's buddy <Spinner animation="grow" size="sm" /> <Spinner animation="grow" size="sm" /> <Spinner animation="grow" size="sm" /></div>)

  return (
    <div className={styles.wrapper}>
      <div className={styles.section}>
        <div className={styles.pic}></div>
        <div className={styles.info}>
          <div>{buddy.firstName} {buddy.lastName}</div>
        </div>
      </div>
      <div className={styles.section}>
        <div className={styles.pic}></div>
        { activity ?
          <div className={styles.info}>
            <div>Activity: {activity.name}</div>
          </div> : null }
      </div>
    </div>
  )
}

export default Matchup
