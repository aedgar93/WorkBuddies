import React, { useEffect, useState, useContext } from 'react'
import styles from './SendInvites.module.css'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'
import { AuthUserContext } from '../../session'
import { FirebaseContext } from '../../firebaseComponents'
import Spinner from 'react-bootstrap/Spinner'
import CloudSponge from '../cloudSponge'


const addBlankInvite = (list) => {
  list.push({name: '', email: ''})
  return list
}

const SendInvites = ({ onNext, onSubmit }) => {
  const [loading, setLoading] = useState(false)
  const [pendingInvites, setPendingInvites] = useState(addBlankInvite([]))
  const [error, setError] = useState(null)
  const auth = useContext(AuthUserContext)
  const firebase = useContext(FirebaseContext)
  const addressBookRef = React.createRef();


  //Work around because the address book (cloudsponge) is not part of the react lifecycle
  useEffect(() => {
    addressBookRef.current.updateOptions({ afterSubmitContacts: getContacts })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ pendingInvites ])


  const handleSubmit = (event) => {
    //TODO: prevent invites for emails that already have accounts
    //TODO: make sure emails are valid before submitting
    setError(null)
    event.preventDefault()
    const form = event.currentTarget;
    if (form.checkValidity() === false) return
    let collection = firebase.db.collection('invites')
    let batch = firebase.db.batch();
    setLoading(true)

    pendingInvites.forEach(invite => {
      let ref = collection.doc()
      batch.set(ref, {
        email: invite.email,
        name: invite.name,
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
    console.log(getPendingInvites())

    if(!results || results.length === 0) return
    let invitesCopy = [...getPendingInvites()]

    let last = invitesCopy[invitesCopy.length -1]

    if(last.email === '' && last.name === '') {
      invitesCopy.pop()
    }

    results.forEach(contact => {
      let email = contact.selectedEmail() || ""
      if (!email) return null
      invitesCopy.push({
        email,
        name: contact.fullName() || ""
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
    <div className={styles.container}>
      <CloudSponge options={{ afterSubmitContacts: getContacts }} ref={addressBookRef}>
        <Button className="cloudsponge-launch">
            Add From Address Book
        </Button>
      </CloudSponge>
      <Form onSubmit={handleSubmit}>
        <div className={styles.inviteForm}>
          {
            pendingInvites.map((val, i) => {
              return (
                <div key={i} className={styles.invite}>
                  <Form.Control type="email" placeholder="Name (optional)"  className={styles.addInput} onChange={e => handleNameChange(e, i)} value={val.name}/>
                  <Form.Control type="email" required placeholder="Email" className={styles.addInput} onChange={e => handleEmailChange(e, i)} value={val.email}/>
                  {
                    i === 0 ?
                      <Button className={styles.addButton} onClick={appendNewInvite} variant="outline-primary"> Add </Button>
                      : null
                  }
                </div>
              )
            })
          }
        </div>
        <Button onClick={handleSubmit} disabled={loading} className={styles.inviteButton}>Invite</Button>
        {
          onNext ?
          <Button onClick={onNext} disabled={loading} variant="outline-primary">Next Time</Button>
          : null
        }
      </Form>
      {
        error ? <Alert variant={error.type ? error.type : 'danger'} className={styles.error}>{error.message ? error.message : error}</Alert> : null
      }
    </div>
  )
}

export default SendInvites
