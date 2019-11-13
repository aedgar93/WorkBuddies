// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { withFirebase } from '../../firebaseComponents'
import { withAuth } from '../../session'
import moment from 'moment-timezone'
import Spinner from 'react-bootstrap/Spinner'

const Matchup = ({ auth, firebase }) => {
  const [buddy, setBuddy] = useState(null)
  const [activity, setActivity] = useState(null)
  const [error, setError] = useState(null)
  const defaultErrorMessage = 'Oh no! Something went wrong.'

  useEffect(() => {
    async function fetchBuddies(){
      //Get your buddy
      let date = moment(auth.company.matchUpTime).local().format('H a MMM Do')

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
  if(!buddy) return (<div>Fetching this week's buddy <Spinner animation="grow" size="sm" /> <Spinner animation="grow" size="sm" /> <Spinner animation="grow" size="sm" /></div>)

  return (
    <div>
      <div>{buddy.firstName} {buddy.lastName}</div>
      <div>Activity: {activity}</div>
    </div>
  )
}

export default withAuth(withFirebase(Matchup))
