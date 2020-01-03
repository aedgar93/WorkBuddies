import React, { useContext, useState, useEffect } from 'react'
import styles from './EditAccount.module.css'
import { AuthUserContext } from '../../session'
import FirebaseContext from '../../firebaseComponents/context'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'
import Modal from 'react-bootstrap/Modal'
import Alert from 'react-bootstrap/Alert'


const EditAccount = ({history}) => {
  const auth = useContext(AuthUserContext)
  let firebase = useContext(FirebaseContext)
  let [email, setEmail] = useState(auth.user.email)
  let [valid, setValid] = useState(true)
  let [notifyEmail, setNotifyEmail] = useState(auth.user.notifyEmail)
  let [loading, setLoading] = useState(false)
  let [showModal, setShowModal] = useState(false)
  let [confirmPassword, setConfirmPassword] = useState("")
  let [confirmPasswordError, setConfirmPasswordError] = useState(null)
  let [confirmPasswordLoading, setConfirmPasswordLoading] = useState(false)
  let [message, setMessage] = useState(false)
  let [reauthPromise, setReauthPromise] = useState(null)

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

  const handleClose = () => {
    reauthPromise.reject()
    setShowModal(false)
  }

  const handlePasswordSubmit = () => {
    setConfirmPasswordError(null)
    setConfirmPasswordLoading(true)

    try {
      const credential = firebase.auth.app.firebase_.auth.EmailAuthProvider.credential(
        auth.email,
        confirmPassword
      );
      auth.reauthenticateWithCredential(credential)
      .then(() => {
        reauthPromise.resolve()
        setShowModal(false)
      })
      .catch((error) => {
        setConfirmPasswordError(error.message ? error.message : error)
        setConfirmPasswordLoading(false)
      })
    } catch(error) {
      setConfirmPasswordError("Something went wrong. Please check your password and try again")
      setConfirmPasswordLoading(false)
    }
  }

  const reauth = () => {
    let deferred = defer()
    setConfirmPassword("")
    setConfirmPasswordError(null)
    setConfirmPasswordLoading(false)
    setShowModal(true)
    setReauthPromise(deferred)
    return deferred.promise
  }

  const handleSubmit = async (e) => {
    setMessage(false)
    e.preventDefault()
    setLoading(true)
    let promises = []
    if(email !== auth.user.email) {
      await reauth()
      console.log('here')
      promises.push(auth.updateEmail(email))
    }

    promises.push(
      firebase.db.collection('users').doc(auth.user.id).update({
        email,
        notifyEmail
      })
    )

    Promise.all(promises).then(() => {
      firebase.db.collection('users').doc(auth.user.id).get()
      .then(doc => {
        if(doc.exists) {
          auth.updateUser(doc)
        }
        setMessage({message : 'Updates Saved!', type: 'success'})
      })
    })
    .catch(err => {
      setMessage({message: err.message ? err.message : err, type: 'danger'})
    })
    .finally(() => {
      setLoading(false)
    })
  }

  useEffect(() => {
    let valid = email && email !== ''
    setValid(valid)
  }, [email])

  return (
    <div className={styles.wrapper} onSubmit={handleSubmit}>
      <div className={styles.section}>
        <h2>My Account</h2>
        {
          message ?
          <Alert variant={message.type ? message.type : 'success'}>{message.message}</Alert>
          : null
        }
        <Form className={styles.form}>
          <Form.Group controlId="email" className={styles.formGroup}>
            <Form.Label>Email address</Form.Label>
            <Form.Control
              required
              type="email"
              value={email}
              placeholder="Enter email"
              onChange={e => setEmail(e.target.value)}/>
          </Form.Group>
          <Form.Group controlId="notifications" className={styles.formGroup}>
            <Form.Label>Notification Preferences</Form.Label>
            <Form.Check
              checked={notifyEmail}
              type="checkbox"
              label="Email"
              onChange={e => setNotifyEmail(e.target.checked)}
              />
          </Form.Group>
          <Button variant="primary" type="submit" className={styles.button} disabled={!valid || loading}>
            {
              loading ?
                <Spinner
                  className={styles.buttonSpinner}
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                /> : null
            }
            Submit
          </Button>
        </Form>
      </div>
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Please Enter Your Password</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {
            confirmPasswordError ?
            <Alert variant="danger">{confirmPasswordError}</Alert> : null
          }
          <Form.Control
              required
              type="password"
              value={confirmPassword}
              placeholder="Enter password"
              onChange={e => setConfirmPassword(e.target.value)}/>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Close</Button>
          <Button variant="primary" onClick={handlePasswordSubmit} disabled={confirmPasswordLoading || !confirmPassword}>
            {
              confirmPasswordLoading ?
                <Spinner
                  className={styles.buttonSpinner}
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                /> : null
            }
            Submit
            </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default EditAccount
