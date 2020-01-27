import React, { useEffect, useState, useContext } from 'react'
import styles from './Invites.module.css'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { AuthUserContext } from '../../session'
import { FirebaseContext } from '../../firebaseComponents'
import Spinner from 'react-bootstrap/Spinner'
import CloudSponge from '../cloudSponge'


const Invites = () => {
  const [inviteRefs, setInviteRefs] = useState(null)
  const [addingUser, setAddingUser] = useState(false)
  const [invitedEmail, setInvitedEmail] = useState("")
  const [error, setError] = useState(null)
  const auth = useContext(AuthUserContext)
  const firebase = useContext(FirebaseContext)

  useEffect(() => {
    if(!auth || !auth.companyRef) return
    let invitesListener = firebase.db.collection('invites').where('company_uid', '==', auth.companyRef.id)
    .onSnapshot(snapshot => {
      if(snapshot.metadata.hasPendingWrites) return
      if(snapshot && snapshot.docs) return setInviteRefs(snapshot.docs.sort((a, b) =>  b.data().createdAt - a.data().createdAt))
      setInviteRefs([])
    })

    return function cleanup() {
      invitesListener()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ auth && auth.companyRef && auth.companyRef.id ])

  const getInvitedEmails = () => {
    return inviteRefs.map(ref => {
      return ref.data().email
    })
  }

  const handleSubmit = (event) => {
    //TODO: prevent invites for emails that already have accounts
    setError(null)
    event.preventDefault()
    const form = event.currentTarget;
    if (form.checkValidity() === false) return

    let existingEmails = getInvitedEmails()

    if (existingEmails.indexOf(invitedEmail) > -1) {
      return setError({message: 'You have already invited that email address.', type: 'warning'})
    }
    setAddingUser(true)
    firebase.db.collection('invites').add({
      email: invitedEmail,
      company_uid: auth.companyRef.id,
      createdAt: new Date().getTime()
    }).then(_result => {
        setAddingUser(false)
        setInvitedEmail("")
    }).catch(error => {
      setError({message: error, type: 'danger'})
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
          <CSSTransition
            key={invite.email}
            classNames="slideIn"
            timeout={{
              enter: 500,
              exit: 300,
           }}>
            <div className={styles.inviteContainer}>
              <div>{invite.email}</div>
              <Button variant="outline-danger" onClick={() => handleDelete(ref)}>Delete</Button>
            </div>
          </CSSTransition>
        )
      }) : null
    )
  }

  const getContacts = (results) => {
    setError(null)
    let batch = firebase.db.batch();
    let collection = firebase.db.collection('invites')

    let existingEmails = getInvitedEmails()
    results.forEach(contact => {
      let email = contact.selectedEmail()
      if (!email) return null
      if (existingEmails.indexOf(email) > -1) return
      let invite = {
        email: email,
        company_uid: auth.companyRef.id,
        createdAt: new Date().getTime()
      }
      let ref = collection.doc()
      batch.set(ref, invite)
    })
    return batch.commit()
    .catch(_error => {
      setError({message: error, type: 'danger'})
    })
  }

  return (
    <div>
      {
        inviteRefs ?
          <>
            <CloudSponge options={{ afterSubmitContacts: getContacts.bind(this) }}>
              <Button className="cloudsponge-launch">
                  Add From Address Book
              </Button>
            </CloudSponge>
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
            {
              error ? <Alert variant={error.type ? error.type : 'danger'} className={styles.error}>{error.message ? error.message : error}</Alert> : null
            }
            <TransitionGroup>
                {
                  getInvites()
                }
            </TransitionGroup>
          </>
          :
          <div className={styles.loadingContainer}><Spinner animation="border" size="lg" variant="primary" /></div>
      }
    </div>
  )
}

export default Invites
