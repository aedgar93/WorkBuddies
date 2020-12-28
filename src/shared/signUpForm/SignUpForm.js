import React, { useState, useEffect } from 'react'
import styles from './SignUpForm.module.css'
import { Button, Form, Col, Row }  from 'react-bootstrap';

const SignUpForm = ({ loading, onSubmit, suggestedEmail, showCompanyName  }) => {
  const [validated, setValidated] = useState(false)
  const [email, setEmail] = useState(suggestedEmail ? suggestedEmail : "")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [password1, setPassword1] = useState('')
  const [password2, setPassword2] = useState('')
  const [password1Touched, setPassword1Touched] = useState(false)
  const [password2Touched, setPassword2Touched] = useState(false)
  const [typingTimer, setTypingTimer] = useState(null)
  const doneTypingInterval = 1500;


  useEffect(() => {
    let valid = email && email !== '' && password1 !== '' && password2 !== '' && password1 === password2 && firstName !== '' && lastName !== ''
    if (showCompanyName) {
      valid = valid && companyName && companyName !== ''
    }
    setValidated(valid)
  }, [email, password1, password2, firstName, lastName, companyName, showCompanyName])

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit({ email, password1, password2, firstName, lastName, companyName })
  }

  const getPasswordError = () => {
    if(!password1Touched) return ''

    if(!isPasswordValid(password1)) return 'Your password must be at least 8 characters'
    if(password2Touched && password1 !== password2) return 'Passwords do not match'
    return ''
  }

  const isPasswordValid = (password) => {
    return password.length >= 8
  }

  return (
    <Form onSubmit={handleSubmit} validated={validated} className={styles.content}>
       <Form.Group className={styles.formGroup}>
          <Row>
            <Col sm={12} md={6} className={styles.column}>
              <Form.Control
                className={styles.input}
                name="firstName"
                value={firstName}
                placeholder="First name"
                required
                isValid={firstName !== ""}
                onChange={e => setFirstName(e.target.value)}
              />
            </Col>
            <Col sm={12} md={6} className={styles.column}>
              <Form.Control
                className={styles.input}
                name="lastName"
                value={lastName}
                placeholder="Last name"
                required
                isValid={lastName !== ""}
                onChange={e => setLastName(e.target.value)}
              />
            </Col>
          </Row>
        </Form.Group>

        <Form.Group controlId="formBasicEmail" className={styles.formGroup}>
          <Form.Control
            className={styles.input}
            required
            type="email"
            value={email}
            placeholder="Enter email"
            onChange={e => { setEmail(e.target.value,); }}/>
        </Form.Group>

      {
        showCompanyName ?
        <Form.Group controlId="formBasicCompany" className={styles.formGroup}>
          <Form.Control
            className={styles.input}
            required
            type="text"
            value={companyName}
            placeholder="Company Name"
            onChange={e => { setCompanyName(e.target.value,); }}/>
        </Form.Group> : null
      }

        <Form.Group controlId="formBasicPassword1" className={styles.formGroup}>
          <Form.Control
            className={styles.input}
            required
            value={password1}
            name="password1"
            type="password"
            placeholder="Password (min. 8 characters)"
            isValid={isPasswordValid(password1)}
            onChange={e => {
              setPassword1(e.target.value)
              clearTimeout(typingTimer)
              setTypingTimer(setTimeout(() => setPassword1Touched(true), doneTypingInterval))
            }}
            onBlur={() => setPassword1Touched(true)}/>
        </Form.Group>
        <Form.Group controlId="formBasicPassword2" className={styles.formGroup}>
          <Form.Control
            className={styles.input}
            name="password2"
            type="password"
            value={password2}
            isValid={isPasswordValid(password2) && password1 === password2}
            isInvalid={ password2Touched && password1 !== password2}
            placeholder="Confirm Password"
            onChange={e => {
              setPassword2(e.target.value);
              setPassword2Touched(true)
              }}/>
            <div className={styles.passwordError}>{getPasswordError()}</div>
        </Form.Group>
        <div className={styles.buttonContainer}>
          <Button variant="primary" type="submit" className={styles.button} disabled={loading} size="lg">
            Sign Up
          </Button>
        </div>
      </Form>
  )
}

export default SignUpForm
