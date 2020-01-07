import React, { useState, useContext } from 'react'
import styles from './CreateCompany.module.css'
import CompanyForm from '../../shared/companyForm'
import { ROUTES } from '../../utils/constants'
import Alert from 'react-bootstrap/Alert'
import { FirebaseContext } from '../../firebaseComponents'
import SignUpForm from '../../shared/signUpForm'
import SampleActivities from '../../shared/sampleActivities'

const CreateCompany = ({ history, location }) => {
  const [company, setCompany] = useState({})
  const [error, setError] = useState(null)
  const [showCompany, setShowCompany] = useState(true)
  const [selectedActivities, setSelectedActivities] = useState(location.state.selectedActivities ? location.state.selectedActivities : [])
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

  const onSubmit = async (userInfo) => {
    setError(false)
    let {name, hour, day, timeZone } = company
    let { firstName, lastName, email, password1 } = userInfo
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
        </>
      }
    </div>
  )
}

export default CreateCompany
