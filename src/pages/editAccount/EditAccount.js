import React, { useContext, useState } from 'react'
import {
  useLocation
} from 'react-router-dom';
import styles from './EditAccount.module.css'
import { AuthUserContext } from '../../session'
import { FirebaseContext } from '../../firebaseComponents'
import { Form, Button, Spinner, Modal, Alert, Row, Col, Container} from 'react-bootstrap'
import AvatarEditor from 'react-avatar-editor'
import ProfilePic from '../../shared/profilePic'
import { AvailabilitySelector } from '../../shared/availability'
import AutosaveInput from '../../shared/autosaveInput'
import { TrackingContext } from '../../tracking'
import Checkbox from '../../shared/checkbox'
import { CookieSettings } from '../../shared/cookies'

const SECTIONS = {
  PROFILE: 0,
  AVAILABILITY: 1
}

const EditAccount = () => {
  const location = useLocation()
  console.log(location.state)
  const auth = useContext(AuthUserContext)
  const firebase = useContext(FirebaseContext)
  const storage = firebase.storage.ref();
  const tracking = useContext(TrackingContext)
  const [email, setEmail] = useState(auth.user.email)
  const [firstName, setFirstName] = useState(auth.user.firstName)
  const [lastName, setLastName] = useState(auth.user.lastName)
  const [department, setDepartment] = useState(auth.user.department ? auth.user.department : '')
  const [about, setAbout] = useState(auth.user.about ? auth.user.about : '')
  const [notifyEmail, setNotifyEmail] = useState(auth.user.notifyEmail)
  const [showModal, setShowModal] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState("")
  const [confirmPasswordError, setConfirmPasswordError] = useState(null)
  const [confirmPasswordLoading, setConfirmPasswordLoading] = useState(false)
  const [message, setMessage] = useState(false)
  const [reauthPromise, setReauthPromise] = useState(null)
  const [showPicModal, setShowPicModal] = useState(false)
  const [picLoading, setPicLoading] = useState(false)
  const [pic, setPic] = useState(null)
  const [editor, setEditor] = useState(null)
  const [picError, setPicError] = useState(null)
  const [isCookiePopupVisible, setIsCookiePopupVisible] = useState(false)
  const [activeSection, setActiveSection] = useState(location.state && typeof location.state.activeSection !== 'undefined' ? location.state.activeSection : SECTIONS.PROFILE)

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

  const updateUserVal = async (name, value) => {
    tracking.updateProfile(name)
    setMessage(false)
    let promises = []
    if(name === 'email' && email !== auth.user.email) {
      await reauth()
      promises.push(auth.updateEmail(email))
    }

    let updateData = {}
    updateData[name] = value
    promises.push(
      firebase.db.collection('users').doc(auth.user.id).update(updateData)
    )

    return Promise.all(promises).then(() => {
      firebase.db.collection('users').doc(auth.user.id).get()
      .then(doc => {
        if(doc.exists) {
          auth.updateUser(doc)
        }
      })
    })
    .catch(err => {
      setMessage({message: err.message ? err.message : err, type: 'danger'})
    })
  }

  const updateNotifyEmail = (val) => {
    tracking.updateProfile('email notifications')
    setNotifyEmail(val)
    firebase.db.collection('users').doc(auth.user.id).update({
      notifyEmail: val
    })
  }

  const openPicModal = () => {
    setPic(null)
    setPicLoading(false)
    setPicError(null)
    setShowPicModal(true)
  }

  const uploadPic = () => {
    tracking.updateProfile('picture')
    try {
      let pic = editor.getImageScaledToCanvas()
      if(!pic) return //TODO better error handling
      setPicLoading(true)
      pic.toBlob(function(blob){
        const name = 'profilePics/' + auth.user.id
        const task = storage.child(name).put(blob);
        task
        .then(snapshot => snapshot.ref.getDownloadURL())
        .then(async url => {
          //set url on user
          await firebase.db.collection('users').doc(auth.user.id).update({
            profilePic: url
          })
          return firebase.db.collection('users').doc(auth.user.id).get().then(doc => {
            if(doc.exists) {
              auth.updateUser(doc)
            }
            setMessage({message : 'Profile Picture Updated!', type: 'success'})
            setShowPicModal(false)
            setPicLoading(false)
          })
        })

      });
    } catch(_error) {
      setPicError("Sorry! Something went wrong. Please try again.")
      setPicLoading(false)
    }
  }

  return (
    <div className={styles.wrapper}>
      <Container fluid={true}>
          <Row>
            <Col md={3}>
              <div className={styles.nav}>
                <button className={`${styles.navButton} ${activeSection === SECTIONS.PROFILE ? styles.navButtonActive : ''}`} onClick={() => setActiveSection(SECTIONS.PROFILE)}>Profile</button>
                <a href="#notifications" className={styles.subNavButton} onClick={() => setActiveSection(SECTIONS.PROFILE)}>Notification</a>
                <button className={`${styles.navButton} ${activeSection === SECTIONS.AVAILABILITY ? styles.navButtonActive : ''}`} onClick={() => setActiveSection(SECTIONS.AVAILABILITY)}>Availability</button>
              </div>
            </Col>
            <Col md={8} lg={6} xl={6}>
            {(
                () => {
                  switch(activeSection) {
                    case SECTIONS.PROFILE:
                      return (
                        <>
                        <div className={styles.profileSection}>
                            {
                              message ?
                              <Alert variant={message.type ? message.type : 'success'}>{message.message}</Alert>
                              : null
                            }
                            <div className={styles.content}>

                              <div className={styles.leftLabel}>
                                <div className={styles.title}>Profile</div>
                                <ProfilePic onClick={openPicModal} user={auth.user}>
                                  <div className={styles.editPic}>
                                    Edit
                                  </div>
                                </ProfilePic>
                              </div>
                              <Form className={styles.form}>
                                <Form.Group className={styles.formGroup} bsPrefix="wb">
                                  <Row>
                                    <Col>
                                      <AutosaveInput
                                        className={styles.input}
                                        name="firstName"
                                        value={firstName}
                                        placeholder="First name"
                                        required
                                        onChange={e => setFirstName(e.target.value)}
                                        onSave={val => updateUserVal('firstName', val)}
                                      />
                                    </Col>
                                    <Col>
                                      <AutosaveInput
                                        className={styles.input}
                                        name="lastName"
                                        value={lastName}
                                        placeholder="Last name"
                                        required
                                        onChange={e => setLastName(e.target.value)}
                                        onSave={val => updateUserVal('lastName', val)}
                                      />
                                    </Col>
                                  </Row>
                                </Form.Group>
                                <Form.Group controlId="email" className={styles.formGroup} bsPrefix="wb">
                                  <AutosaveInput
                                    required
                                    className={styles.input}
                                    type="email"
                                    value={email}
                                    placeholder="Email"
                                    onSave={val => updateUserVal('email', val)}
                                    onChange={e => setEmail(e.target.value)}/>
                                </Form.Group>
                                <Form.Group controlId="department" className={styles.formGroup} bsPrefix="wb">
                                  <AutosaveInput
                                    className={styles.input}
                                    type="text"
                                    value={department}
                                    placeholder="Department"
                                    onSave={val => updateUserVal('department', val)}
                                    onChange={e => setDepartment(e.target.value)}/>
                                </Form.Group>
                                <Form.Group controlId="aboutMe" className={styles.formGroup} bsPrefix="wb">
                                  <AutosaveInput
                                    as="textarea"
                                    value={about}
                                    placeholder="About me"
                                    className={styles.textarea}
                                    onSave={val => updateUserVal('about', val)}
                                    onChange={e => setAbout(e.target.value)}/>
                                </Form.Group>
                              </Form>
                          </div>
                        </div>
                        <div className={styles.profileSection} id="notifications">
                          <div className={styles.leftLabel}>
                            <div className={styles.title}>Notification</div>
                          </div>
                          <Form>
                            <Form.Group controlId="notifications" className={styles.formCheck} bsPrefix="wb">
                                <div className={styles.notifyLabel}>Email</div>
                                <Checkbox id="notifyEmail" checked={notifyEmail} onChange={updateNotifyEmail} />
                            </Form.Group>
                          </Form>
                        </div>
                        <div className={styles.profileSection}>
                          <div className={styles.leftLabel}>
                            <div className={styles.title}>Cookies</div>
                          </div>
                          <Form>
                            <Form.Group controlId="cookies" className={styles.formCheck} bsPrefix="wb">
                              <Checkbox id="cookies" checked={tracking.consent} onChange={tracking.setConsent} />
                              <div className={styles.cookieSettings} onClick={() => setIsCookiePopupVisible(!isCookiePopupVisible)}>Settings<span className={styles.arrow}> {isCookiePopupVisible ? "<" : ">" }</span></div>
                            </Form.Group>
                          </Form>
                        </div>
                        </>
                      )
                      case SECTIONS.AVAILABILITY:
                        return (
                          <div className={styles.section}>
                            <div className={styles.sectionInner}>
                              <div className={styles.title}>Availability</div>
                              <AvailabilitySelector />
                            </div>
                          </div>
                        )
                      default:
                        return null;
                      }

                    }
            )()}
          </Col>
        </Row>
      </Container>
      { isCookiePopupVisible && activeSection === SECTIONS.PROFILE ? (
        <div className={styles.cookieWrapper}>
          <div className={styles.cookiesInner}>
            <CookieSettings />
          </div>
        </div>
        ) : null }
      <Modal show={showModal} onHide={handleClose} centered={true}>
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


      <Modal show={showPicModal} onHide={() => setShowPicModal(false)} centered={true}>
        <Modal.Header closeButton>
          <Modal.Title>Upload a Picture</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {
            picError ? <Alert variant="danger">{picError}</Alert> : null
          }
          <input type="file" onChange={(e) => setPic(e.target.files[0]) } />
          {
            pic ?
            <div className={styles.profilePreview}>
              <AvatarEditor
                ref={setEditor}
                image={pic}
                width={250}
                height={250}
                border={50}
                borderRadius={250}
                scale={1}
                rotate={0}
              />
            </div>
            : null
          }
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPicModal(false)}>Close</Button>
          <Button variant="primary" onClick={uploadPic} disabled={picLoading || !pic}>
            {
              picLoading ?
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
