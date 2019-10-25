// eslint-disable-next-line no-unused-vars
import React, { useState, useContext, useEffect } from 'react';
import styles from './SignUp.module.css'
import { FirebaseContext } from '../../firebaseComponents'
import { ROUTES } from '../../utils/constants'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Alert from 'react-bootstrap/Alert'

const SignUp = ({ history }) => {
  let [email, setEmail] = useState('')
  let [firstName, setFirstName] = useState('')
  let [lastName, setLastName] = useState('')
  let [password1, setPassword1] = useState('')
  let [password2, setPassword2] = useState('')
  let [passwordTouched, setPasswordTouched] = useState(false)
  let [error, setError] = useState(null)
  let [validated, setValidated] = useState(false)
  let [loading, setLoading] = useState(false)
  let firebase = useContext(FirebaseContext)

  const onSubmit = event => {
    event.preventDefault()
    setError(null)
    setLoading(true)

    firebase.createUserWithEmailAndPassword(email, password1)
    .then((result) => {
      firebase.db.collection('users').add({
        auth_id: result.user.uid,
        firstName: firstName,
        lastName: lastName,
        company: 'Q3YTnubqC9lPp4VvQ1Vx'
      }).then(() => {
        history.push(ROUTES.BASE)
      })
    }).catch(setError)
  }

  useEffect(() => {
    let valid = email !== '' && password1 !== '' && password2 !== '' && password1 === password2 && firstName !== '' && lastName !== ''
    setValidated(valid)
  }, [email, password1, password2, firstName, lastName])

  return (
    <div className={styles.wrapper}>
      <Form onSubmit={onSubmit} validated={validated}>
      <Form.Group controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control
          required
          type="email"
          placeholder="Enter email"
          isValid={email !== ""}
          onChange={e => { setEmail(e.target.value,); }}/>
      </Form.Group>

      <Form.Group>
        <Row>
          <Col>
            <Form.Control
              name="firstName"
              placeholder="First name"
              required
              isValid={firstName !== ""}
              onChange={e => setFirstName(e.target.value)}
            />
          </Col>
          <Col>
            <Form.Control
              name="lastName"
              placeholder="Last name"
              required
              isValid={lastName !== ""}
              onChange={e => setLastName(e.target.value)}
            />
          </Col>
        </Row>
      </Form.Group>

      <Form.Group controlId="formBasicPassword1">
        <Form.Label>Password</Form.Label>
        <Form.Control
          required
          name="password1"
          type="password"
          placeholder="Password"
          isValid={password1 !== ""}
          onChange={e => setPassword1(e.target.value)}/>
      </Form.Group>
      <Form.Group controlId="formBasicPassword2">
        <Form.Label>Confirm Password</Form.Label>
        <Form.Control
          name="password2"
          type="password"
          isValid={password2 !== "" && password1 === password2}
          isInvalid={passwordTouched && password1 !== password2}
          placeholder="Confirm Password"
          onChange={e => {
            setPassword2(e.target.value);
            setPasswordTouched(true)
            }}/>
          <Form.Control.Feedback type="invalid">Passwords do not match</Form.Control.Feedback>
      </Form.Group>
      <div className={styles.buttonContainer}>
        <Button variant="primary" type="submit" className={styles.button} disabled={!validated || loading}>
          Submit
        </Button>
      </div>
      {
        error ? <Alert variant="danger" className={styles.alert}>Something went wrong. Please try again. </Alert> : null
      }
    </Form>
  </div>
  );
}

export default SignUp
