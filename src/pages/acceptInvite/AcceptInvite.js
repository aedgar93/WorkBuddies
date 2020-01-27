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

const AcceptInvite = ({ history, match }) => {
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [companyId, setCompanyId] = useState(null)
  const [ready, setReady] = useState(false)
  const [inviteId, setInviteId] = useState(null)
  const [suggestedEmail, setSuggestedEmail] = useState(null)
  const [invites, setInvites] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [ selectInvitePromise, setSelectInvitePromise ] = useState(null)
  const firebase = useContext(FirebaseContext)
  const code  = match && match.params && match.params.code

  const defer = () => {
    var deferred = {
      promise: null,
      resolve: null,
      reject: null
    };

    deferred.promise = new Promise((resolve, reject) => {
      deferred.resolve = resolve;
      deferred.reject = reject;
    });

    return deferred;
  }

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

  const inviteSelected = (invite) => {
    selectInvitePromise.resolve({inviteId: invite.id, companyId: invite.data().company_uid})
  }

  const openSelectInvite = (docs) => {
    //TODO: find all invites and make them pick
    setInvites(null)
    let promises = []
    docs.forEach(invite => {
      if(!invite.data() || !invite.data().company_uid) return
      promises.push(
        firebase.db.collection('companies').doc(invite.data().company_uid).get()
        .then(snapshot => {
          invite.company = snapshot.data()
          return invite
        })
      )
    })
    Promise.all(promises)
    .then(results => setInvites(results))
    let deferred = defer()
    setShowModal(true)
    setSelectInvitePromise(deferred)
    return deferred.promise
  }

  const findAssociatedInvites = ({ email }) => {
      return firebase.db.collection('invites').where('email', '==', email).get()
      .then(snapshot => {
        if(!snapshot.docs || snapshot.docs.length === 0) {
          setError("Sorry! We couldn't find any invitations using that email address.")
          return Promise.reject()
        } else if(snapshot.docs.length > 1) {
          return openSelectInvite(snapshot.docs)
        } else {
          let doc = snapshot.docs[0]
          return { companyId: doc.data().companyId, inviteId: doc.id }
        }
      })

  }

  const acceptInvite = async (accountInfo, companyId, inviteId) => {
    if (!companyId) return Promise.reject('Company not found')
    if (!inviteId) return Promise.reject('Invite not found')
    let { email, password1, firstName, lastName } = accountInfo
    let { user } = await firebase.createUserWithEmailAndPassword(email, password1)
    let promises = []
    promises.push(firebase.db.collection('users').add({
      auth_id: user.uid,
      firstName,
      lastName,
      email,
      notifyEmail: true,
      company_uid: companyId,
      admin: false
    }))
    promises.push(firebase.db.collection('invites').doc(inviteId).delete()) //TODO: maybe just move this to cloud function. delete all invites with this email when a user is created
    Promise.all(promises)
    .then(() => {
      history.push(ROUTES.BASE)
    })
    .catch(updateError)
  }

  const onSubmit = async (accountInfo) => {
    setError(null)
    setLoading(true)
    if (!code) {
      findAssociatedInvites(accountInfo)
      .then(({inviteId, companyId}) => {
        setShowModal(false)
        return acceptInvite(accountInfo, companyId, inviteId)
      })
    } else {
      acceptInvite(accountInfo, companyId, inviteId)
    }

  }

  const updateError = (error) => {
    setError(error)
    setLoading(false)
  }


  if (!ready) return (<Spinner animation="border" size="lg" variant="primary"/>)
  return (
    <div className={styles.wrapper}>
      <h3>Welcome!</h3>
      <div className={styles.subtitle}>
        {
          code ? "Create your account" : "Already have an invite? Please sign up using the email address where your received your invite."
        }
      </div>
      <SignUpForm onSubmit={onSubmit} loading={loading} suggestedEmail={suggestedEmail}/>
      {
        error ? <Alert variant="danger" className={styles.alert}>Something went wrong. Please try again.</Alert> : null
      }

    <Modal show={showModal}>
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
                    onClick={() => inviteSelected(invite)}>
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
