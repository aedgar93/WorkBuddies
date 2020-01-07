// eslint-disable-next-line no-unused-vars
import React, { useState, useContext, useEffect } from 'react';
import styles from './AcceptInvite.module.css'
import { FirebaseContext } from '../../firebaseComponents'
import { ROUTES } from '../../utils/constants'
import Alert from 'react-bootstrap/Alert'
import Spinner from 'react-bootstrap/Spinner'
import SignUpForm from '../../shared/signUpForm/SignUpForm';

const AcceptInvite = ({ history, match }) => {
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [companyId, setCompanyId] = useState(null)
  const [ready, setReady] = useState(false)
  const [inviteId, setInviteId] = useState(null)
  const [ suggestedEmail, setSuggestedEmail] = useState(null)
  const firebase = useContext(FirebaseContext)
  console.log(match)
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



  const onSubmit = async (accountInfo) => {
    setError(null)
    setLoading(true)
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
    promises.push(firebase.db.collection('invites').doc(inviteId).delete())
    Promise.all(promises)
    .then(() => {
      history.push(ROUTES.BASE)
    })
    .catch(updateError)
  }

  const updateError = (error) => {
    setError(error)
    setLoading(false)
  }


  if (!ready) return (<Spinner animation="border" size="lg" variant="primary"/>)
  return (
    <div className={styles.wrapper}>
      <h3>Welcome!</h3>
      <div className={styles.subtitle}>Create your account</div>
      <SignUpForm onSubmit={onSubmit} loading={loading} suggestedEmail={suggestedEmail}/>
      {
        error ? <Alert variant="danger" className={styles.alert}>Something went wrong. Please try again.</Alert> : null
      }
    </div>
  );
}

export default AcceptInvite
