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
import Spinner from 'react-bootstrap/Spinner'

const SignUp = ({ history, match }) => {
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [password1, setPassword1] = useState('')
  const [password2, setPassword2] = useState('')
  const [passwordTouched, setPasswordTouched] = useState(false)
  const [error, setError] = useState(null)
  const [validated, setValidated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [companyId, setCompanyId] = useState(null)
  const [inviteId, setInviteId] = useState(null)
  const firebase = useContext(FirebaseContext)
  const companyInfo = history.location.state && history.location.state.company
  const code  = match && match.params && match.params.code

  useEffect(() => {
    //set up
    if (code) {
      firebase.db.collection('invites').where('code', '==', code).get()
      .then(snapshot => {
        if(!snapshot.docs || snapshot.docs.length === 0) return history.push(ROUTES.GET_STARTED).state({error: 'Sorry, that invite is no longer valid.'})
        let data = snapshot.docs[0].data()
        setCompanyId(data.company_uid)
        setEmail(data.email)
        setInviteId(snapshot.docs[0].id)
      })
    } else if(!verifyCompanyInfo()) {
      companyError()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const verifyCompanyInfo = () => {
    if (!history.location.state || !history.location.state.company) return false
    let {name, hour, day, timeZone } = history.location.state.company
    console.log(history.location.state)
    return name && typeof hour === 'number' && typeof day === 'number' && timeZone
  }

  const companyError = (error) => {
    console.error(error)
    history.push(ROUTES.GET_STARTED, {error: 'There was an error setting up your company. Please try again'})
  }

  const signUp = async (admin, id = companyId) => {
    if (!id) return Promise.reject('Company not found')
    let { user } = await firebase.createUserWithEmailAndPassword(email, password1)
    let promises = []
    promises.push(firebase.db.collection('users').add({
      auth_id: user.uid,
      firstName,
      lastName,
      email,
      company_uid: id,
      admin
    }))
    if(inviteId) {
      promises.push(firebase.db.collection('invites').doc(inviteId).delete())
    }
    Promise.all(promises)
    .then(() => {
      history.push(ROUTES.BASE)
    })
  }

  const createCompany = () => {
    if (!verifyCompanyInfo()) return Promise.reject()

    let {name, hour, day, timeZone } = history.location.state.company
    return firebase.db.collection('companies').add({
      name,
      hour,
      day,
      timeZone
    }).then(docRef => {
      setCompanyId(docRef.id)
      return docRef.id
    })
  }

  async function onSubmit(event) {
    event.preventDefault()
    setError(null)
    setLoading(true)
    let isAdmin = false
    let id = companyId
    if(companyInfo) {
      //create company
      try {
        id = await createCompany()
      } catch(err) {
        companyError(err)
      }
      isAdmin = true
    }
    signUp(isAdmin, id)
    .catch(updateError)
  }

  const updateError = (error) => {
    setError(error)
    setLoading(false)
  }

  useEffect(() => {
    let valid = email !== '' && password1 !== '' && password2 !== '' && password1 === password2 && firstName !== '' && lastName !== ''
    setValidated(valid)
  }, [email, password1, password2, firstName, lastName])

  if (!companyInfo && !companyId) return (<Spinner animation="border" size="lg" variant="primary"/>)
  return (
    <div className={styles.wrapper}>
      { companyInfo ? <h3>Step 2</h3> : <h3>Welcome!</h3>}
      <div className={styles.subtitle}>Create your account</div>
      <Form onSubmit={onSubmit} validated={validated} className={styles.content}>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            required
            type="email"
            value={email}
            placeholder="Enter email"
            isValid={email !== ""}
            onChange={e => { setEmail(e.target.value,); }}/>
        </Form.Group>

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
          <Button variant="primary" type="submit" className={styles.button} disabled={!validated || loading}>
            Submit
          </Button>
        </div>
        {
          error ? <Alert variant="danger" className={styles.alert}>Something went wrong. Please try again.</Alert> : null
        }
      </Form>
    </div>
  );
}

export default SignUp
