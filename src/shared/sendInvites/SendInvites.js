import React, { useState, useContext } from 'react'
import styles from './SendInvites.module.css'
import { Form, Button, Alert } from 'react-bootstrap'
import { AuthUserContext } from '../../session'
import { FirebaseContext } from '../../firebaseComponents'
import { TrackingContext } from '../../tracking'
import Media from 'react-media'
import ContactImport from '../contactImport'

const addBlankInvite = (list) => {
  list.push({name: '', email: ''})
  return list
}

const SendInvites = ({ onNext, onSubmit }) => {
  const [loading, setLoading] = useState(false)
  const [pendingInvites, setPendingInvites] = useState(addBlankInvite([]))
  const [error, setError] = useState(null)
  const [showImporter, setShowImporter] = useState(false)
  const auth = useContext(AuthUserContext)
  const firebase = useContext(FirebaseContext)
  const tracking = useContext(TrackingContext)



  const handleSubmit = (event) => {
    //TODO: prevent invites for emails that already have accounts
    //TODO: make sure emails are valid before submitting
    if(!pendingInvites || !pendingInvites.length) return
    tracking.invite(pendingInvites.length)
    window.localStorage.setItem('invitesSent_' + auth.company.id, pendingInvites.length)
    setError(null)
    event.preventDefault()
    const form = event.currentTarget;
    if (form.checkValidity() === false) return
    let collection = firebase.db.collection('invites')
    let batch = firebase.db.batch();
    setLoading(true)

    pendingInvites.forEach(invite => {
      if(!invite.email) return
      let ref = collection.doc()
      batch.set(ref, {
        email: invite.email,
        name: invite.name,
        invitedBy: auth.user.id,
        company_uid: auth.companyRef.id,
        createdAt: new Date().getTime()
      })
    })

    return batch.commit()
    .then(async results => {
        onSubmit && onSubmit()
        setPendingInvites(addBlankInvite([]))
        setLoading(false)
    }).catch(error => {
      console.log(error)
      setError({message: error, type: 'danger'})
      setLoading(false)
    })
  }

  const handleNameChange = (event, index) => {
    if(index < pendingInvites.length) {
      let invitesCopy = [...pendingInvites]
      invitesCopy[index].name = event.target.value
      setPendingInvites(invitesCopy)
    }
  }

  const handleEmailChange = (event, index) => {
    if(index < pendingInvites.length) {
      let invitesCopy = [...pendingInvites]
      invitesCopy[index].email = event.target.value
      setPendingInvites(invitesCopy)
    }
  }

  const getPendingInvites = () => {
    return pendingInvites
  }


  const getContacts = (results) => {
    setError(null)
    setShowImporter(false)
    if(!results || results.length === 0) return
    let invitesCopy = [...getPendingInvites()]

    let last = invitesCopy[invitesCopy.length -1]

    if(last.email === '' && last.name === '') {
      invitesCopy.pop()
    }

    results.forEach(contact => {
      let email = contact.email || ""
      if (!email) return null
      invitesCopy.push({
        email,
        name: contact.name || ""
      })
    })

    if(invitesCopy.length >= 1) setPendingInvites(invitesCopy)
  }

  const appendNewInvite = () => {
    let invitesCopy = [...pendingInvites]
    addBlankInvite(invitesCopy)
    setPendingInvites(invitesCopy)
  }

  return (
    <>
      <Media query={{maxWidth: 600}}>
        {isMobile =>
        <div className={styles.container}>
          <Button className={styles.importButton} onClick={() => setShowImporter(true)}>
              Add From Address Book
          </Button>
          <ContactImport onSubmit={getContacts} isVisible={showImporter} setIsVisible={setShowImporter}/>
          <Form onSubmit={handleSubmit}>
            <div className={styles.inviteForm}>
              {
                pendingInvites.map((val, i) => {
                  return (
                    <div key={i} className={styles.invite}>
                      <Form.Control type="email" placeholder="Name (optional)"  className={styles.addInput} onChange={e => handleNameChange(e, i)} value={val.name}/>
                      <Form.Control type="email" required placeholder="Email" className={styles.addInput} onChange={e => handleEmailChange(e, i)} value={val.email}/>
                      {
                        !isMobile && i === 0 ?
                          <Button className={styles.addButton} onClick={appendNewInvite} variant="outline-primary"> Add </Button>
                          : null
                      }
                    </div>
                  )
                })
              }
              { isMobile ? <Button className={styles.addButton} onClick={appendNewInvite} variant="outline-primary"> Add </Button> : null }
            </div>
            <Button onClick={handleSubmit} disabled={loading} className={styles.inviteButton} size="lg">Invite</Button>
            {
              onNext ?
              <Button onClick={onNext} disabled={loading} variant="outline-primary" size="lg">Next Time</Button>
              : null
            }
          </Form>
          {
            error ? <Alert variant={error.type ? error.type : 'danger'} className={styles.error}>{error.message ? error.message : error}</Alert> : null
          }
        </div>
      }
      </Media>
    </>
  )
}

export default SendInvites
