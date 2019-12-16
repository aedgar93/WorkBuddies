import React, { useEffect, useState, useContext } from 'react'
import styles from './Invites.module.css'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { AuthUserContext } from '../../session'
import { FirebaseContext } from '../../firebaseComponents'
import Spinner from 'react-bootstrap/Spinner'


const Invites = () => {
  const [inviteRefs, setInviteRefs] = useState(null)
  const [addingUser, setAddingUser] = useState(false)
  const [invitedEmail, setInvitedEmail] = useState("")
  const auth = useContext(AuthUserContext)
  const firebase = useContext(FirebaseContext)

  useEffect(() => {
    let invitesListener = firebase.db.collection('invites').where('company_uid', '==', auth.companyRef.id)
    .onSnapshot(snapshot => {
      if(snapshot.metadata.hasPendingWrites) return
      if(snapshot && snapshot.docs) return setInviteRefs(snapshot.docs.sort((a, b) =>  b.data().createdAt - a.data().createdAt))
      setInviteRefs([])
    })

    return function cleanup() {
      invitesListener()
    }
  })

  const handleSubmit = (event) => {
    event.preventDefault()
    const form = event.currentTarget;
    if (form.checkValidity() === false) return

    setAddingUser(true)
    firebase.db.collection('invites').add({
      email: invitedEmail,
      company_uid: auth.companyRef.id,
      createdAt: new Date().getTime()
    }).then(_result => {
        setAddingUser(false)
        setInvitedEmail("")
    }).catch(_error => {
      //TODO: error
      setAddingUser(false)

    })
  }

  const handleChange = (event) => {
    setInvitedEmail(event.target.value)
  }


  const handleDelete = (ref) => {
    // eslint-disable-next-line no-restricted-globals
    if(confirm('Are you sure you want to delete this invite?')) {
      ref.ref.delete()
    }
  }

  const getInvites = () => {
    return (
      inviteRefs ? inviteRefs.map(ref => {

        let invite = ref.data()
        return (
          <div key={invite.email} className={styles.inviteContainer}>
            <div>{invite.email}</div>
            <Button variant="outline-danger" onClick={() => handleDelete(ref)}>Delete</Button>
          </div>
        )
      }) : null
    )
  }

  return (
    <div>
      {
        inviteRefs ?
          <>
            <Form onSubmit={handleSubmit}>
              <div className={styles.inviteForm}>
                <Form.Control type="email" required placeholder="Enter an email" name="invitedEmail" className={styles.addInput} onChange={handleChange} value={invitedEmail}/>
                <Button className={styles.addButton} type="submit">
                  {
                    addingUser ?
                    <Spinner
                        className={styles.buttonSpinner}
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                    : null
                  }
                  Add
                </Button>
              </div>
            </Form>
          </>
          :
          <div className={styles.loadingContainer}><Spinner animation="border" size="lg" variant="primary" /></div>
      }
      <ReactCSSTransitionGroup
        transitionName="slideIn"
        transitionEnterTimeout={500}
        transitionLeaveTimeout={300}>
          {
            getInvites()
          }
      </ReactCSSTransitionGroup>
    </div>
  )
}

export default Invites
