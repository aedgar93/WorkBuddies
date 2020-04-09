// eslint-disable-next-line no-unused-vars
import React, { useState, useContext, useEffect } from 'react';
import { AuthUserContext } from '../../session'
import { FirebaseContext } from '../../firebaseComponents'
import styles from './EditEmployees.module.css'
import UserCard from '../../shared/userCard'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Spinner from 'react-bootstrap/Spinner'
import SendInvites from '../../shared/sendInvites'
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import Button from 'react-bootstrap/Button'

const EditEmployees = () => {
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
  }, [])


  useEffect(() => {
    if(!auth || !auth.companyRef) return
    updateInvites()
    console.log('use effect')
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ auth && auth.companyRef && auth.companyRef.id ])

  const updateInvites = () => {
    console.log('here')
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
    // eslint-disable-next-line no-restricted-globals
    if(confirm('Are you sure you want to delete this invite?')) {
      ref.ref.delete()
      let invitesCopy = [...inviteRefs]
      invitesCopy.splice(index, 1)
      setInviteRefs(invitesCopy)
    }
  }

  const getInvites = () => {
    return (
      inviteRefs ? inviteRefs.map((ref, i) => {

        let invite = ref.data()
        return (
          <CSSTransition
            key={`${invite.email}_${invite.name}`}
            classNames="slideIn"
            timeout={{
              enter: 500,
              exit: 300,
           }}>
            <div className={styles.inviteContainer}>
              <div>
                {invite.name}
                <br/>
                {invite.email}
              </div>
              <Button variant="outline-danger" onClick={() => handleDeleteInvite(ref, i)}>Delete</Button>
            </div>
          </CSSTransition>
        )
      }) : null
    )
  }


  return (
    <div className={styles.wrapper}>
      <div className={styles.section}>
        <h2>Employees</h2>
        {
          userRefs ?
            <Row>
              {userRefs.map((ref, i) => {
                let user = ref.data()
                return (
                  <Col xs={12} s={6} m={6} l={6} xl={6} key={i} className={styles.user}>
                    <UserCard user={user}/>
                  </Col>
                )
              })}
            </Row> :
            <div className={styles.loadingContainer}><Spinner animation="border" size="lg" variant="primary" /></div>
        }
      </div>

      <div className={styles.section}>
        <h2>Invites</h2>
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
    </div>
  )
}

export default EditEmployees
