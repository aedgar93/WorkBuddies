import React, { useContext, useState, useEffect } from 'react'
import styles from './EditAccount.module.css'
import { AuthUserContext } from '../../session'
import FirebaseContext from '../../firebaseComponents/context'
import { Form, Button, Spinner, Modal, Alert, Row, Col} from 'react-bootstrap'
import AvatarEditor from 'react-avatar-editor'
import ProfilePic from '../../shared/profilePic'
import { AvailabilitySelector } from '../../shared/availability'
import AutosaveInput from '../../shared/autosaveInput'


const EditAccount = () => {
  const auth = useContext(AuthUserContext)
  const firebase = useContext(FirebaseContext)
  const storage = firebase.storage.ref();
  let [email, setEmail] = useState(auth.user.email)
  let [firstName, setFirstName] = useState(auth.user.firstName)
  let [lastName, setLastName] = useState(auth.user.lastName)
  let [department, setDepartment] = useState(auth.user.department ? auth.user.department : '')
  let [about, setAbout] = useState(auth.user.about ? auth.user.about : '')
  let [notifyEmail, setNotifyEmail] = useState(auth.user.notifyEmail)
  let [showModal, setShowModal] = useState(false)
  let [confirmPassword, setConfirmPassword] = useState("")
  let [confirmPasswordError, setConfirmPasswordError] = useState(null)
  let [confirmPasswordLoading, setConfirmPasswordLoading] = useState(false)
  let [message, setMessage] = useState(false)
  let [reauthPromise, setReauthPromise] = useState(null)
  let [showPicModal, setShowPicModal] = useState(false)
  let [picLoading, setPicLoading] = useState(false)
  let [pic, setPic] = useState(null)
  let [editor, setEditor] = useState(null)
  let [picError, setPicError] = useState(null)

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
      <div className={styles.section}>
        <div className={styles.sectionInner}>
          {
            message ?
            <Alert variant={message.type ? message.type : 'success'}>{message.message}</Alert>
            : null
          }
          <div className={styles.content}>

            <div className={styles.about}>
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
      </div>
      <div className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={styles.title}>Availability</div>
          <AvailabilitySelector />
        </div>
      </div>
      <div className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={styles.title}>Notification</div>
          <Form>
            <Form.Group controlId="notifications" className={styles.formCheck} bsPrefix="wb">
                <div className={styles.notifyLabel}>Email</div>
                <div className={styles.checkboxContainer}>
                  <span className={notifyEmail ? styles.checked : styles.noCheck} onClick={() => updateNotifyEmail(!notifyEmail)}></span>
                  <input id="notifyEmail" checked={notifyEmail} type="checkbox" onChange={e => updateNotifyEmail(e.target.checked)} className={styles.checkInput}/>
                  <label htmlFor="notifyEmail">{ notifyEmail ? 'On' : 'Off'}</label>
                </div>
            </Form.Group>
          </Form>
        </div>
      </div>
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
