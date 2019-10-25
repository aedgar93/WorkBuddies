// eslint-disable-next-line no-unused-vars
import React, { useState, useContext } from 'react';
import styles from './SignIn.module.css'
import { Link } from 'react-router-dom';
import { FirebaseContext } from '../../firebaseComponents'
import { ROUTES } from '../../utils/constants'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';

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
      console.log(error)
      setError(error)
      setLoading(false)
    })
  }

  const onChange = () => {
    setValidated(email !== '' && password !== '')
  }

  return (
    <div className={styles.wrapper}>
      <Form onSubmit={onSubmit} validated={validated} onChange={onChange}>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            required
            type="email"
            placeholder="Enter email"
            onChange={e => setEmail(e.target.value)}/>
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            required
            type="password"
            placeholder="Password"
            onChange={e => setPassword(e.target.value)}/>
        </Form.Group>
        <div className={styles.buttonContainer}>
          <Button variant="primary" type="submit"  disabled={!validated || loading}>
            Submit
          </Button>
        </div>
        {
          error ? <Alert variant="danger" className={styles.alert}>Incorrect email address or password</Alert> : null
        }
      </Form>
      <div className={styles.signUp}>
        Don't have an account? <Link to={ROUTES.SIGN_UP}>Click here to sign up.</Link>
      </div>
    </div>
    );
}

export default SignIn
