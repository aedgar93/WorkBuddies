// eslint-disable-next-line no-unused-vars
import React, { useState, useContext, useEffect } from 'react';
import styles from './SignIn.module.css'
import { Link } from 'react-router-dom';
import { FirebaseContext } from '../../firebaseComponents'
import { ROUTES } from 'wb-utils/constants'
import { Button, Form, Alert } from 'react-bootstrap';

const SignIn = ({ history }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [validated, setValidated] = useState(false);
  let firebase = useContext(FirebaseContext)

  const onSubmit = event => {
    event.preventDefault()
    setError(null)
    setLoading(true)

    firebase.signInWithEmailAndPassword(email, password)
    .then(() => {
      history.push(ROUTES.BASE)
    })
    .catch(( error ) => {
      setError(error)
      setLoading(false)
    })
  }

  useEffect(() => {
    let valid = email !== '' && password !== ''
    setValidated(valid)
  }, [email, password])

  return (
    <div className={styles.wrapper}>
      <h3 className={styles.title}>Login to Work Buddies</h3>
      <Form onSubmit={onSubmit} validated={validated} className={styles.form}>
        <Form.Group controlId="formBasicEmail">
          <Form.Control
            className={styles.input}
            required
            type="email"
            placeholder="Email"
            onChange={e => setEmail(e.target.value)}/>
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Control
            className={styles.input}
            required
            type="password"
            placeholder="Password"
            onChange={e => setPassword(e.target.value)}/>
        </Form.Group>
        <div className={styles.buttonContainer}>
          <Button variant="primary" type="submit"  disabled={!validated || loading} className={styles.button}>
            Login
          </Button>
          <Link to={ROUTES.ACCEPT_INVITE} className={styles.inviteLink}>I have an invitation</Link>

        </div>
        {
          error ? <Alert variant="danger" className={styles.alert}>Incorrect email address or password</Alert> : null
        }
      </Form>
    </div>
    );
}

export default SignIn
