import React, { useState, useContext } from 'react'
import styles from './CreateCompany.module.css'
import { ROUTES } from '../../utils/constants'
import { Alert, Modal, Button } from 'react-bootstrap'
import { FirebaseContext } from '../../firebaseComponents'
import SignUpForm from '../../shared/signUpForm'
import moment from 'moment-timezone'
import suggestedActivities from '../../utils/sampleActivities'


const CreateCompany = ({ history }) => {
  const [error, setError] = useState(null)
  const [invites, setInvites] = useState([])
  const [loading, setLoading] = useState(false)
  const firebase = useContext(FirebaseContext)
  const genericError = 'Something went wrong! Please try again.'



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

  const updateError = (error) => {
    setLoading(false)
    setError(error ? error : genericError)
  }


  const create = async (info) => {
    setInvites([])
    if(!info) {
      return updateError()
    }

    let { firstName, lastName, email, password1, companyName } = info
    if (!companyName) {
      return updateError('Please add a name for your company.')
    }

    try {
      var { user } = await firebase.createUserWithEmailAndPassword(email, password1)
    } catch(error) {
      return updateError(error.message)
    }
    firebase.db.collection('companies').add({
      name: companyName,
      hour: 9,
      day: 1,
      timeZone: moment.tz.guess()
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
      promises.concat(suggestedActivities.map(({name}) => {
        return activityCollection.add({
          name
        })
      }))

      Promise.all(promises)
      .then(() => { history.push(ROUTES.WELCOME) })
      .catch((error) => {
        console.error(error)
        updateError(genericError)
      })
    })
    .catch((error) => {
      console.error(error)
      updateError(genericError)
    })
  }

  const onSubmit = async (info) => {
    setError(false)
    setLoading(true)
    let existingInvites = await checkInvites(info.email)
    if (!existingInvites || existingInvites.length === 0) return create(info)

    //invites already exist, have them either select an invite or submit new company
    setInvites(existingInvites)
  }

  const goToInvite = (invite) => {
    history.push({
      pathname: ROUTES.SIGN_UP + '/' + invite.code
    })
  }

  return (
  <div className={styles.wrapper}>
      { error ? <Alert variant="danger">{ error }</Alert> : null}
        <>
          <h3 className={styles.title}>
            Start using Work Buddies!
          </h3>
          <SignUpForm onSubmit={onSubmit} showCompanyName={true} loading={loading}/>

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
    </div>
  )
}

export default CreateCompany
