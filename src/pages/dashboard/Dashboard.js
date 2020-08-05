// eslint-disable-next-line no-unused-vars
import React, { useState, useContext, useEffect } from 'react';
import { FirebaseContext } from '../../firebaseComponents'
import styles from './Dashboard.module.css'
import { Spinner, Button } from 'react-bootstrap'
import { AuthUserContext } from '../../session'
import Activity from '../../shared/activity'
import ProfilePic from '../../shared/profilePic';
import {
  Link
} from 'react-router-dom';
import { ROUTES } from 'wb-utils/constants'
import invite_icon from '../../assets/images/invite.svg'
import { Availability } from '../../shared/availability';
import calendar_icon from '../../assets/images/calendar.svg'
import { ReactComponent as CheckIcon } from '../../assets/images/check_circle.svg'
import { TrackingContext } from '../../tracking'


const states = {
  LOADING: 0,
  NO_BUDDY: 1,
  BUDDY: 2,
  ERROR: 3
}

const Dashboard = ({ location }) => {
  const [activities, setActivities] = useState([])
  const [buddies, setBuddies] = useState(null)
  const [activity, setActivity] = useState(null)
  const [state, setState] = useState(states.LOADING)
  const [error, setError] = useState(null)
  const [showActivities, setShowActivities] = useState(null)
  const [showInviteAlert] = useState(location && location.state && location.state.showInviteAlert)

  const defaultErrorMessage = 'Oh no! Something went wrong.'
  const auth = useContext(AuthUserContext)
  const firebase = useContext(FirebaseContext)
  const tracking = useContext(TrackingContext)

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

    let buddyIds = [...matchup.buddies]

    let myIndex = buddyIds.findIndex(id => id === auth.user.id)
    buddyIds.splice(myIndex, 1)

    let buddyData = []
    for(let i = 0; i < buddyIds.length; i++) {
      let id = buddyIds[i]
      let buddySnapshot = await firebase.db.collection('users').doc(id).get()
      if(buddySnapshot.exists) {
        buddyData.push(buddySnapshot.data())
      }
    }


    if(buddyData.length > 0) {
      setBuddies(buddyData)
      setActivity(matchup.activity)
      setState(states.BUDDY)

    } else {
      setState(states.ERROR)
      return setError(`Sorry, we had trouble finding your buddy`)
    }
  }

  useEffect(() => {
    if (!auth || auth.waitingForAuth) return
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

  const schedule = (buddy1, buddy2) => {
    tracking.mixpanel.track('schedule click')
    let subject = "I'm your weekly buddy"
    let body = `Hello ${buddy1.firstName}${buddy2 && buddy2.email ? ' and ' + buddy2.firstName : ''},%0D%0A %0D%0A We've been matched up as work buddies this week. Can we schedule a time this week to ${activity.name}?%0D%0A %0D%0ASincerely, ${auth.user.firstName}`
    window.location.href = `mailto:${buddy1.email}${buddy2 ? `,${buddy2.email}` : ''}?subject=${subject}&body=${body}`;
  }

  const renderBuddy = (buddy, buddy2) => {

    return (
      <div className={styles.matchup}>
        <div className={styles.picWrapper}>
          <ProfilePic user={buddy} size={80} style={{boxShadow: '0 2px 4px 0 rgba(0,0,0,0.24)'}}/>
        </div>
        <div className={styles.info} style={buddy2 && buddy.availability ? {marginBottom: '50px'} : {}}>
          <div className={styles.name}>{buddy.firstName} {buddy.lastName}</div>
          <div className={styles.department}>{buddy.department}</div>
          { buddy.about ? <div className={styles.about}>"{buddy.about}"</div> : null }
        </div>
        <div className={styles.divider}></div>
        <Availability user={buddy} />
      </div>
    )
  }


  const renderBuddies = () => {
    let buddy1 = buddies[0]
    let buddy2 = buddies.length > 1 ? buddies[1] : null

    return (
      <div className={styles.topCard}>
        <div className={styles.title}>This Week, Let's <span className={styles.activity}>{activity.name}</span> with:</div>
        <div className={styles.matchups}>
          { renderBuddy(buddy1, buddy2) }
          { buddy2 ?
            <>
             <div className={styles.divider}></div>
              { renderBuddy(buddy2, buddy1, activity) }
            </> : null }
          <Button className={styles.scheduleButton} onClick={() => schedule(buddy1, buddy2)}>
            <img src={calendar_icon} className={styles.scheduleIcon} alt="Calendar"/>
            {`Schedule with ${buddy1.firstName}${buddy2 ? ' and ' + buddy2.firstName : ''} `}
          </Button>
          {
            buddy1.availability || (buddy2 && buddy2.availability) ?
            <div className={styles.scheduleNote}>
              Here are a couple available time slots from {buddy2 ? 'your buddies' : buddy1.firstName}. <br/>
              Don’t hesitate to reach out if you don’t see a fit here.
            </div>
            : null
          }
        </div>
      </div>
    )
  }

  const renderNoBuddy = () => {
    return (
      <>
        { showInviteAlert ?
          <>
            <div className={styles.inviteCard}>
              <div className={styles.inviteSent}><img src={invite_icon} alt="Invitation" className={styles.inviteImage}/> Invitation Sent!</div>
              <div className={styles.inviteDetails}>Once your buddies sign up, we will notify you.</div>
            </div>
            <div className={`${styles.divider} ${styles.inviteSentDivider}`}></div>
          </>
         :
          <>
            <div className={styles.noMatch}>
                <div className={styles.welcome}>Welcome, {auth.user && auth.user.firstName}</div>
                <div className={styles.noMatchText}>You don't have any buddies to match with yet.</div>
                <div className={styles.noMatchInfo}>We’re waiting for other buddies to signup. Come back and check out your buddy later.</div>
            </div>
            <div className={`${styles.divider} ${styles.noMatchDivider}`}></div>
         </>
         }
      </>
    )
  }

  const renderMatchup = () => {
    if(error && state === states.ERROR) return (<div>{error}</div>)
    return (
      <div className={styles.matchupWrapper}>
        {
          state === states.BUDDY ? renderBuddies() : renderNoBuddy()
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
          <div className={styles.otherItemsContainer}>
            <div className={styles.otherItemsHeader} onClick={() => setShowActivities(!showActivities)}>
              <span className={styles.otherItemsText}>View other suggested activities</span>
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

  const renderNoBuddyOptions = () => {
    return (
      <>
        <div className={styles.otherLabel}>For a better experience, please complete the following items.</div>
        {
          !auth.user.admin ?
          <>
            <Link to={ROUTES.MY_ACCOUNT} className={styles.otherItemLink}>
              <div className={styles.otherItemsContainer}>
                <div className={styles.otherItemsHeader}>
                  <span className={styles.otherItemsText}>Manage notifications</span>
                </div>
              </div>
            </Link>
            <Link to={{pathname: ROUTES.MY_ACCOUNT, state: {activeSection: 1}}} className={styles.otherItemLink}>
              <div className={styles.otherItemsContainer}>
                <div className={styles.otherItemsHeader}>
                  <span className={styles.otherItemsText}>Update your availability</span>
                </div>
              </div>
            </Link>
          </>
          :
          <>
            <Link to={ROUTES.MY_ACCOUNT} className={styles.otherItemLink}>
              <div className={styles.otherItemsContainer}>
                <div className={styles.otherItemsHeader}>
                  <span className={styles.otherItemsText}>Update your profile</span>
                  <Check done={auth.user.department || auth.user.about} />
                </div>
              </div>
            </Link>
            <Link to={{pathname: ROUTES.EDIT_COMPANY, state: {activeSection: 1}}} className={styles.otherItemLink}>
              <div className={styles.otherItemsContainer}>
                <div className={styles.otherItemsHeader}>
                  <span className={styles.otherItemsText}>Pick activities</span>
                  <Check done={window.localStorage.getItem('activitiesUpdated_' + auth.company.id)} />
                </div>
              </div>
            </Link>
            <Link to={{pathname: ROUTES.EDIT_COMPANY, state: {activeSection: 3}}} className={styles.otherItemLink}>
              <div className={styles.otherItemsContainer}>
                <div className={styles.otherItemsHeader}>
                  <span className={styles.otherItemsText}>Invite team members</span>
                  <Check done={window.localStorage.getItem('invitesSent_' + auth.company.id)} />
                </div>
              </div>
            </Link>
          </>
        }
      </>
    )
  }

  const renderMoreOptions = () => {
    switch(state) {
      case states.BUDDY:
        return (
          <>
          { renderActivities() }
          <Link to={{pathname: ROUTES.MY_ACCOUNT, state: {activeSection: 1}}}  className={styles.otherItemLink}>
            <div className={styles.otherItemsContainer}>
              <div className={styles.otherItemsHeader}>
                <span className={styles.otherItemsText}>Update your availability</span>
              </div>
            </div>
          </Link>
          </>
        )
      case states.NO_BUDDY: return renderNoBuddyOptions()
      case states.ERROR:
      default: return null
    }
  }

  if (!auth || auth.waitingForAuth || state === states.LOADING) return <div style={{marginTop: '50px'}}><Spinner animation="border" size="lg" variant="primary"/></div>
  return (
    <div>

      <div className={styles.wrapper}>
        { renderMatchup() }
      </div>

      <div className={`${styles.section} ${styles.wrapper}`}>
        { renderMoreOptions() }
      </div>
    </div>
  )
}

const Check = ({done}) => {
 return (
    <span className={`${styles.otherItemCheck} ${done ? styles.checked : ''}`}><CheckIcon /></span>
 )
}

export default Dashboard
