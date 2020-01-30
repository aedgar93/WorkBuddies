import React, { useState, useContext } from 'react'
import styles from './CreateCompany.module.css'
import CompanyForm from '../../shared/companyForm'
import { ROUTES } from '../../utils/constants'
import Alert from 'react-bootstrap/Alert'
import { FirebaseContext } from '../../firebaseComponents'
import SignUpForm from '../../shared/signUpForm'
import SampleActivities from '../../shared/sampleActivities'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

const CreateCompany = ({ history, location }) => {
  const [company, setCompany] = useState({})
  const [error, setError] = useState(null)
  const [showCompany, setShowCompany] = useState(true)
  const [selectedActivities, setSelectedActivities] = useState(location.state && location.state.selectedActivities ? location.state.selectedActivities : [])
  const [userInfo, setUserInfo] = useState(null)
  const [invites, setInvites] = useState([])
  const firebase = useContext(FirebaseContext)
  const genericError = 'Something went wrong! Please try again.'

  const submitCompany = (company) => {
    let {name, hour, day, timeZone } = company
    let valid = name && typeof hour === 'number' && typeof day === 'number' && timeZone
    setError(!valid)
    if (valid) {
      setCompany(company)
      setShowCompany(false)
    }
  }

  const back = () => {
    setError(false)
    setShowCompany(true)
  }

  const checkInvites = (email) => {
    return firebase.db.collection('invites').where('email', '==', email).get()
    .then(snapshot => {
      if(!snapshot.docs || snapshot.docs.length === 0) return []
      let promises = []
      snapshot.docs.forEach(invite => {
        if(!invite.data() || !invite.data().company_uid) return
        promises.push(
          firebase.db.collection('companies').doc(invite.data().company_uid).get()
          .then(snapshot => {
            let info = invite.data()
            info.id = invite.id
            info.company = snapshot.data()
            return info
          })
        )
      })
      return Promise.all(promises)
    })
  }


  const create = async (info) => {
    setInvites([])
    let infoToUse = info ? info : userInfo
    if(!infoToUse) {
      return setError('Something went wrong! Please try again.')
    }

    let {name, hour, day, timeZone } = company
    let { firstName, lastName, email, password1 } = infoToUse
    try {
      var { user } = await firebase.createUserWithEmailAndPassword(email, password1)
    } catch(error) {
      return setError(error.message)
    }
    firebase.db.collection('companies').add({
      name,
      hour,
      day,
      timeZone
    })
    .then(companyRef => {
      let promises = []
      let companyId = companyRef.id
      firebase.db.collection('users').add({
        auth_id: user.uid,
        firstName,
        lastName,
        email,
        notifyEmail: true,
        company_uid: companyId,
        admin: true
      })

      let activityCollection = companyRef.collection('activities')
      promises.concat(selectedActivities.map(({name, icon}) => {
        return activityCollection.add({
          name,
          icon
        })
      }))

      Promise.all(promises)
      .then(() => { history.push(ROUTES.SET_UP_EMPLOYEES) })
      .catch((error) => {
        console.error(error)
        setError(genericError)
      })
    })
    .catch((error) => {
      console.error(error)
      setError(genericError)
    })
  }

  const onSubmit = async (info) => {
    setError(false)
    setUserInfo(info)
    let existingInvites = await checkInvites(info.email)
    if (!existingInvites || existingInvites.length === 0) return create(info)

    //invites already exist, have them either select an invite or submit new company
    setInvites(existingInvites)
  }

  const goToInvite = (invite) => {
    history.push({
      pathname: ROUTES.SIGN_UP + '/' + invite.code,
      state: userInfo
    })
  }

  return (
    <div className={styles.wrapper}>
      { error ? <Alert variant="danger">{ error }</Alert> : null}
      { showCompany ?
        <>
          <h3>
            Let's create your organization
          </h3>
          <CompanyForm onSubmit={submitCompany} name={company.name} timeZone={company.timeZone} day={company.day} hour={company.hour}>
            <div className={styles.sampleActivities}>
              <h3>Pick Activities</h3>
              <SampleActivities setSelectedActivities={setSelectedActivities} selectedActivities={selectedActivities}/>
            </div>
          </CompanyForm>
          <div className={styles.helpText}>
            Looking to join a company? Please contact your company admin and request an invite email.
          </div>
        </>
        :
        <>
          <h3 className={styles.title}>
            Let's get you set up as well
          </h3>
          <button onClick={back} className={styles.backButton}>&lsaquo; Back</button>
          <SignUpForm onSubmit={onSubmit}/>

          <Modal show={invites && invites.length >= 1}>
            <Modal.Header closeButton>
              <Modal.Title>It looks like you have already been invited to {invites.length === 1 ? 'a company': 'multiple companies'}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <div>Would you like to join an existing company or continue with creating your own?</div>
                {
                  invites && invites.map(invite => {
                    console.log(invite)
                    return (
                      <div key={invite.id} className={styles.selectCompany}>
                        <Button
                          onClick={() => goToInvite(invite)}>
                          Join {invite.company.name}
                        </Button>
                      </div>
                  )})
                }
                <br/>
                <Button onClick={create}>Create my company</Button>
            </Modal.Body>
          </Modal>
        </>
      }
    </div>
  )
}

export default CreateCompany
