// eslint-disable-next-line no-unused-vars
import React, { useState, useContext, useEffect } from 'react';
import { FirebaseContext } from '../../firebaseComponents'
import styles from './Dashboard.module.css'
import { Spinner, Button, Alert } from 'react-bootstrap'
import { AuthUserContext } from '../../session'
import Activity from '../../shared/activity'
import ProfilePic from '../../shared/profilePic';
import email_icon from '../../assets/images/email_icon.png'
import {
  Link
} from 'react-router-dom';
import { ROUTES } from '../../utils/constants'
import invite_icon from '../../assets/images/invite.svg'
import arrow_right from '../../assets/images/arrow_right.svg'
import arrow_down from '../../assets/images/arrow_down.svg'


const states = {
  LOADING: 0,
  NO_BUDDY: 1,
  BUDDY: 2,
  ERROR: 3
}

const Dashboard = ({ location }) => {
  const [activities, setActivities] = useState([])
  const [buddy, setBuddy] = useState(null)
  const [activity, setActivity] = useState(null)
  const [state, setState] = useState(states.loading)
  const [error, setError] = useState(null)
  const [showActivities, setShowActivities] = useState(null)
  const [showInviteAlert, setShowInviteAlert] = useState(location && location.state && location.state.showInviteAlert)
  const defaultErrorMessage = 'Oh no! Something went wrong.'
  const auth = useContext(AuthUserContext)
  const firebase = useContext(FirebaseContext)

  async function fetchBuddies(){
    //Get your buddy
    if(!auth.company.activeBuddies) {
      return setState(states.NO_BUDDY)
    }
    let snapshot = await auth.companyRef.collection('buddies').doc(auth.company.activeBuddies).get()
    let matchup = snapshot.data().matchups.find(matchup => {
      return matchup.buddies.indexOf(auth.user.id) > -1
    })
    if(!matchup || matchup.buddies.length === 1) {
      return setState(states.NO_BUDDY)

    }

    let buddyId = matchup.buddies.indexOf(auth.user.id) === 0 ? matchup.buddies[1] : matchup.buddies[0]
    let buddySnapshot = await firebase.db.collection('users').doc(buddyId).get()

    if(buddySnapshot.exists) {
      setBuddy(buddySnapshot.data())
      setActivity(matchup.activity)
      //TESTING
      //setState(states.BUDDY)
      setState(states.BUDDY)

    } else {
      setState(states.ERROR)
      return setError(`Sorry, we had trouble finding your buddy`)
    }
  }

  useEffect(() => {
    if (auth.waitingForAuth) return
    let listener = auth.companyRef.collection('activities')
    .onSnapshot(snapshot => {
      let activities = []
      snapshot.forEach(doc => activities.push(doc.data()))
      setActivities(activities)
    })

    fetchBuddies()
    .catch(() => setError(defaultErrorMessage))

    return function cleanup() {
      listener()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.waitingForAuth])

  const renderBuddy = () => {
    let subject = "I'm your weekly buddy"
    let body = `Hello ${buddy.firstName},%0D%0A %0D%0A We've been matched up as work buddies this week. Can we schedule a time this week to ${activity.name}?%0D%0A %0D%0ASincerely, ${auth.user.firstName}`
    return (
      <>
        <div className={styles.title}>This Week, Let's <span className={styles.activity}>{activity.name}</span> with {buddy.firstName}:</div>
        <div className={styles.matchup}>
          <div className={styles.picWrapper}>
            <div className={styles.tagContainer}>
              <div className={styles.activityTag}><div className={styles.activityText}>{activity.name}</div></div>
            </div>
            <ProfilePic user={buddy}/>
          </div>
          <div className={styles.info}>
            <div className={styles.contact}>
              {buddy.firstName} {buddy.lastName}
              { buddy.email ? <a href={`mailto:${buddy.email}?body=${body}&subject=${subject}`}><img src={email_icon} alt="email" className={styles.contactIcon}/></a> : null}
            </div>
            <div className={styles.department}>{buddy.department}</div>
            <div className={styles.about}>"{buddy.about}"</div>
          </div>
        </div>
      </>
    )
  }

  const renderNoBuddy = () => {
    return (
      <>
        <div className={styles.title}>You don't have any buddies to match with yet.</div>
        { showInviteAlert ?
          <div className={styles.inviteCard}>
            <div className={styles.inviteImage}>
              <img src={invite_icon} alt="Invitation"/>
            </div>
            <div className={styles.inviteInfo}>
              <div className={styles.inviteSent}>Invitation Sent!</div>
              <div className={styles.inviteDetails}>Once your buddies sign up, we will notify you</div>
            </div>
            <div className={styles.closeInvite} onClick={() => setShowInviteAlert(false)}></div>
          </div>
         : null}
        {
          auth.user.admin ?
          <div>
            <Button as={Link} to={ROUTES.EDIT_COMPANY}>Invite your team members</Button>
          </div>
          : null
        }
      </>
    )
  }

  const renderMatchup = () => {
    if(error && state === states.ERROR) return (<div>{error}</div>)
    if(state === states.loading) return (<div className={styles.loading}>Fetching this week's buddy <Spinner animation="grow" size="sm" /> <Spinner animation="grow" size="sm" /> <Spinner animation="grow" size="sm" /></div>)

    return (
      <div className={styles.matchupWrapper}>
        {
          state === states.BUDDY ? renderBuddy() : renderNoBuddy()
        }
      </div>
    )
  }

  const renderActivities = () => {
    return (
      <div className={styles.activitiesSection}>
        {
        activities.length === 0 ?
          <div className={styles.subtext}>It looks like your admin hasn't added any activities for your office yet. Some of our favorite suggestions include grabbing a coffee, playing Ping Pong, or going for a walk.</div> :
          <div className={styles.activitiesContainer}>
            <div className={styles.activitiesHeader} onClick={() => setShowActivities(!showActivities)}>
              <div className={styles.dropDownIcon}>{showActivities ? <img src={arrow_down} alt="Down Arrow" className={styles.downIcon}/> : <img src={arrow_right} alt="Right Arrow" className={styles.rightIcon}/>}</div>
              <span className={styles.activitiesText}>Other Suggested Activities:</span>
            </div>
            {
              showActivities ?
              <>
                <div className={styles.activities}>
                  {
                    activities.map((activity, index) => {
                      return <Activity key={activity.name + index} name={activity.name}/>
                    })
                  }
                </div>
                {
                  auth.user.admin ? <Link className={styles.edit} to={ROUTES.EDIT_COMPANY}>Edit</Link> : null
                }
              </> : null
            }
          </div>
        }
      </div>
    )
  }

  const renderNoBuddyActivity = () => {
    return (
      <>
        <Alert variant="primary">Your weekly activity will be randomly assigned by WorkBuddies{auth.user.admin ? <span>, customize your activities at <Link to={ROUTES.EDIT_COMPANY}>My Company</Link>.</span> : <span>.</span>}</Alert>
      </>
    )
  }

  const renderActivitiesContainer = () => {
    switch(state) {
      case states.LOADING: return <div className={styles.loading}><Spinner animation="border" size="lg" variant="primary"/></div>
      case states.BUDDY: return renderActivities()
      case states.NO_BUDDY: return renderNoBuddyActivity()
      case states.ERROR:
      default: return null
    }
  }

  if (auth.waitingForAuth) return <Spinner animation="border" size="lg" variant="primary"/>
  return (
    <div>
      <div className={styles.topBar}>

        <div className={styles.wrapper}>

          <div className={styles.welcome}>Welcome, {auth.user && auth.user.firstName}</div>

          { renderMatchup() }
        </div>
      </div>

      <div className={`${styles.section} ${styles.wrapper}`}>
        { renderActivitiesContainer() }
      </div>
    </div>
  )
}

export default Dashboard
