// eslint-disable-next-line no-unused-vars
import React, { useState, useContext, useEffect } from 'react';
import { AuthUserContext } from '../../session'
import { FirebaseContext } from '../../firebaseComponents'
import styles from './EditEmployees.module.css'
import ProfilePic from '../profilePic'
import { Spinner, Button } from 'react-bootstrap'
import SendInvites from '../sendInvites'
import { CSSTransition, TransitionGroup } from 'react-transition-group';

const EditEmployees = ({ showEmployees = true, showInvites = true}) => {
  const [userRefs, setUserRefs] = useState([])
  const [inviteRefs, setInviteRefs] = useState(null)
  const [updating, setUpdating] = useState(false)
  const auth = useContext(AuthUserContext)
  const firebase = useContext(FirebaseContext)

  useEffect(() => {
    let usersListener = firebase.db.collection('users').where('company_uid', '==', auth.companyRef.id)
    .onSnapshot(snapshot => {
      if(snapshot && snapshot.docs) setUserRefs(snapshot.docs)
    })

    return function cleanup() {
      usersListener()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  useEffect(() => {
    if(!auth || !auth.companyRef) return
    updateInvites()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ auth && auth.companyRef && auth.companyRef.id ])

  const updateInvites = () => {
    setUpdating(true)
    firebase.db.collection('invites').where('company_uid', '==', auth.companyRef.id)
    .get()
    .then(snapshot => {
      setUpdating(false)
      if(snapshot && snapshot.docs) return setInviteRefs(snapshot.docs.sort((a, b) =>  b.data().createdAt - a.data().createdAt))
      setInviteRefs([])
    }).catch(() => setUpdating(false))
  }

  const handleDeleteInvite = (ref, index) => {
    if(window.confirm('Are you sure you want to delete this invite?')) {
      ref.ref.delete()
      let invitesCopy = [...inviteRefs]
      invitesCopy.splice(index, 1)
      setInviteRefs(invitesCopy)
    }
  }

  const handleDeleteUser = (user) => {
    if(window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return
    }
  }


  const getInvites = () => {
    return (
      <>
        <div className={styles.sectionLabel}>Pending Invitations</div>

      { inviteRefs ? inviteRefs.map((ref, i) => {

        let invite = ref.data()
        return (
          <CSSTransition
            key={`${invite.email}_${invite.name}`}
            classNames="slideIn"
            timeout={{
              enter: 500,
              exit: 300,
          }}>
            { renderUser(invite, invite.email + "_" + i, false, () => handleDeleteInvite(ref, i))}
          </CSSTransition>
        )
      }) : null }
      </>
    )
  }

  const renderUser = (user, key, showPic, handleDelete) => {
    let { name, email } = user
    return (
      <div className={styles.inviteContainer} key={key}>
        { showPic ? (
          <div className={styles.picContainer}>
            <ProfilePic user={user} size={46}/>
          </div>
        ) : null }
        <div className={styles.name}>
          {name}
        </div>
        <div className={styles.email}>
          {email}
        </div>
        { handleDelete ? <Button variant="outline-danger" onClick={handleDelete} className={styles.delete}>Delete</Button> : null }
      </div>
    )
  }


  return (
    <div className={styles.wrapper}>
      { showEmployees ? (
        <div className={styles.section}>
          {
            userRefs ?
              <>
                {userRefs.map((ref, i) => {
                  let user = ref.data()
                  user.id = ref.id
                  user.name = user.firstName + " " + user.lastName
                  return renderUser(user, user.id, true)
                })}
              </> :
              <div className={styles.loadingContainer}><Spinner animation="border" size="lg" variant="primary" /></div>
          }
        </div> ) : null
      }

      {
        showInvites ? (
          <div className={styles.section}>
            <SendInvites onSubmit={updateInvites}/>
            {
              updating ? <Spinner /> : null
            }
            <TransitionGroup>
              {
                getInvites()
              }
            </TransitionGroup>
          </div>
        ) : null }
    </div>
  )
}

export default EditEmployees
