// eslint-disable-next-line no-unused-vars
import React, { useState, useContext, useEffect } from 'react';
import styles from './AcceptInvite.module.css'
import { FirebaseContext } from '../../firebaseComponents'
import { ROUTES } from '../../utils/constants'
import Alert from 'react-bootstrap/Alert'
import Spinner from 'react-bootstrap/Spinner'
import SignUpForm from '../../shared/signUpForm/SignUpForm';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

const AcceptInvite = ({ history, match, location }) => {
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [ready, setReady] = useState(false)
  const [suggestedEmail, setSuggestedEmail] = useState(null)
  const [invites, setInvites] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [companyId, setCompanyId] = useState(null)
  const [inviteId, setInviteId] = useState(null)
  const [accountInfo, setAccountInfo] = useState(null)
  const firebase = useContext(FirebaseContext)
  const code  = match && match.params && match.params.code

  useEffect(() => {
    if(code) {
      //set up
      firebase.db.collection('invites').where('code', '==', code).get()
      .then(snapshot => {
        if(!snapshot.docs || snapshot.docs.length === 0) return history.push(ROUTES.GET_STARTED).state({error: 'Sorry, that invite is no longer valid.'})
        let data = snapshot.docs[0].data()
        setCompanyId(data.company_uid)
        setSuggestedEmail(data.email)
        setInviteId(snapshot.docs[0].id)
        setReady(true)
      })
      .catch(err => {
        //TODO: handle error
        setReady(true)
      })
    } else {
      setReady(true)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const openSelectInvite = (docs, accountInfo) => {
    setInvites(null)
    let promises = []
    docs.forEach(invite => {
      if(!invite.data() || !invite.data().company_uid) return
      promises.push(
        firebase.db.collection('companies').doc(invite.data().company_uid).get()
        .then(snapshot => {
          let id = invite.id
          let result = invite.data()
          result.company = snapshot.data()
          result.id = id
          return result
        })
      )
    })
    Promise.all(promises)
    .then(results => {
      results = results.filter(invite => invite && invite.company)
      if(results.length === 0) {
        return updateError("Sorry! We couldn't find any invites for that email address.")
      } else if(results.length === 1) {
        let invite = results[0]
        acceptInvite(invite.data().company_uid, invite.id, accountInfo)
      } else {
        setInvites(results)
        setShowModal(true)
      }
    })
  }

  const findAssociatedInvites = ({ email }) => {
    return firebase.db.collection('invites').where('email', '==', email).get()
      .then(snapshot => {
        return snapshot.docs
      })
  }

  const acceptInvite = async (companyId, inviteId, info = accountInfo) => {
    if (!companyId) {
      updateError('Sorry! Something went wrong. Please try again.')
      return Promise.reject('Company not found')
    }
    if (!inviteId) {
      updateError('Sorry! Something went wrong. Please try again.')
      return Promise.reject('Invite not found')
    }
    let { email, password1, firstName, lastName } = info
    let user
    try {
      let result = await firebase.createUserWithEmailAndPassword(email, password1)
      user = result.user
    } catch(error) {
      console.log(error)
      return updateError(error.message)
    }
    firebase.db.collection('users').add({
      auth_id: user.uid,
      firstName,
      lastName,
      email,
      notifyEmail: true,
      company_uid: companyId,
      admin: false
    })
    .then(() => {
      history.push(ROUTES.BASE)
    })
    .catch(updateError)
  }

  const onSubmit = async (accountInfo) => {
    setError(null)
    setLoading(true)
    setAccountInfo(accountInfo)
    let emailExists = await firebase.doesUserExistForEmail(accountInfo.email)
    if (emailExists) return updateError('Sorry! There is already an account for that email address.')
    if (!code) {
      let invites = await findAssociatedInvites(accountInfo)
      if(!invites || invites.length === 0) return updateError("Sorry! We couldn't find any invites for that email address.")
      else if(invites.length === 1) {
        let invite = invites[0]
        return acceptInvite(invite.data().company_uid, invite.id, accountInfo)
      } else {
        openSelectInvite(invites, accountInfo)
      }
    } else {
      acceptInvite(companyId, inviteId, accountInfo)
    }
  }

  const updateError = (error) => {
    setShowModal(false)
    setError(error)
    setLoading(false)
  }

  const closeModal = () => {
    setShowModal(false)
    setLoading(false)
  }


  if (!ready) return (<Spinner animation="border" size="lg" variant="primary"/>)
  return (
    <div className={styles.wrapper}>
      <h3>Welcome!</h3>
      <div className={styles.subtitle}>
        {
          code ? "Invite found! Create your account" : "Already have an invite? Please sign up using the email address where your received your invite."
        }
        <br/>
      </div>
      {
        error ? <Alert variant="danger" className={styles.alert}>{ error }</Alert> : null
      }
      <SignUpForm onSubmit={onSubmit} loading={loading} suggestedEmail={suggestedEmail} suggestedFirst={location.state && location.state.firstName} suggestedLast={location.state && location.state.lastName}/>

    <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Please select the company you would like to join.</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {
            invites ?
              invites.map(invite => {
              return (
                <div key={invite.id} className={styles.selectCompany}>
                  <Button
                    onClick={() => acceptInvite(invite.company_uid, invite.id)}>
                    {invite.company.name}
                  </Button>
                </div>
              )})
              : "Fetching all invites..."
          }
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default AcceptInvite
