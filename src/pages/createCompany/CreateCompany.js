import React, { useState, useContext } from 'react'
import styles from './CreateCompany.module.css'
import CompanyForm from '../../shared/companyForm'
import { ROUTES } from '../../utils/constants'
import Alert from 'react-bootstrap/Alert'
import { FirebaseContext } from '../../firebaseComponents'
import SignUpForm from '../../shared/signUpForm'

const CreateCompany = ({ history }) => {
  const [company, setCompany] = useState({})
  const [error, setError] = useState(null)
  const [showCompany, setShowCompany] = useState(true)
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
    var deferred = null;
    firebase.createUserPromise = new Promise(function(resolve, reject){
      deferred = {resolve: resolve, reject: reject}
    });
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
      let companyId = companyRef.id
      firebase.db.collection('users').add({
        auth_id: user.uid,
        firstName,
        lastName,
        email,
        company_uid: companyId,
        admin: true
      })
      .then(() => { history.push(ROUTES.BASE) })
      .catch(() => setError(genericError))
      .finally(() => deferred.resolve())
    })
    .catch(() => setError(genericError))

  }

  return (
    <div className={styles.wrapper}>
      { error ? <Alert variant="danger">{ error }</Alert> : null}
      { showCompany ?
        <>
          <h3 className={styles.title}>
            Step 1: Set up your company
          </h3>
          <CompanyForm onSubmit={submitCompany} name={company.name} timeZone={company.timeZone} day={company.day} hour={company.hour}/>
          <div className={styles.helpText}>
            Looking to join a company? Please contact your company admin and request an invite email.
          </div>
        </>
        :
        <>
          <h3 className={styles.title}>
            Step 2: Create your account
          </h3>
          <button onClick={back} className={styles.backButton}>&lsaquo; Back</button>
          <SignUpForm onSubmit={onSubmit}/>
        </>
      }
    </div>
  )
}

export default CreateCompany
