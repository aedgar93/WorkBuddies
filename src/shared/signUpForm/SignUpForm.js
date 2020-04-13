import React, { useState, useEffect } from 'react'
import styles from './SignUpForm.module.css'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

const SignUpForm = ({ loading, onSubmit, suggestedEmail, showCompanyName  }) => {
  const [validated, setValidated] = useState(false)
  const [email, setEmail] = useState(suggestedEmail ? suggestedEmail : "")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [password1, setPassword1] = useState('')
  const [password2, setPassword2] = useState('')
  const [passwordTouched, setPasswordTouched] = useState(false)

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

  return (
    <Form onSubmit={handleSubmit} validated={validated} className={styles.content}>
       <Form.Group>
          <Form.Label>Name</Form.Label>
          <Row>
            <Col>
              <Form.Control
                name="firstName"
                value={firstName}
                placeholder="First name"
                required
                isValid={firstName !== ""}
                onChange={e => setFirstName(e.target.value)}
              />
            </Col>
            <Col>
              <Form.Control
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

        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            required
            type="email"
            value={email}
            placeholder="Enter email"
            onChange={e => { setEmail(e.target.value,); }}/>
        </Form.Group>

      {
        showCompanyName ?
        <Form.Group controlId="formBasicCompany">
          <Form.Label>Company Name</Form.Label>
          <Form.Control
            required
            type="text"
            value={companyName}
            placeholder="Company Name"
            onChange={e => { setCompanyName(e.target.value,); }}/>
        </Form.Group> : null
      }

        <Form.Group controlId="formBasicPassword1">
          <Form.Label>Password</Form.Label>
          <Form.Control
            required
            value={password1}
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
            value={password2}
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
          <Button variant="primary" type="submit" className={styles.button} disabled={loading}>
            Submit
          </Button>
        </div>
      </Form>
  )
}

export default SignUpForm
