// eslint-disable-next-line no-unused-vars
import React, { useState, useContext, useEffect } from 'react';
import { AuthUserContext } from '../../session'
import { FirebaseContext } from '../../firebaseComponents'
import styles from './EditEmployees.module.css'
import UserCard from '../../shared/userCard'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Spinner from 'react-bootstrap/Spinner'
import Invites from '../../shared/invites'

const EditEmployees = () => {
  const [userRefs, setUserRefs] = useState([])
  const auth = useContext(AuthUserContext)
  const firebase = useContext(FirebaseContext)

  useEffect(() => {
    let usersListener = firebase.db.collection('users').where('company_uid', '==', auth.companyRef.id)
    .onSnapshot(snapshot => {
      if(snapshot && snapshot.docs) setUserRefs(snapshot.docs)
    })

    return function cleanup() {
      usersListener()
    }
  })


  return (
    <div className={styles.wrapper}>
      <div className={styles.section}>
        <h2>Employees</h2>
        {
          userRefs ?
            <Row>
              {userRefs.map((ref, i) => {
                let user = ref.data()
                return (
                  <Col xs={12} s={6} m={6} l={6} xl={6} key={i} className={styles.user}>
                    <UserCard email={user.email} firstName={user.firstName} lastName={user.lastName} />
                  </Col>
                )
              })}
            </Row> :
            <div className={styles.loadingContainer}><Spinner animation="border" size="lg" variant="primary" /></div>
        }
      </div>

      <div className={styles.section}>
        <h2>Invites</h2>
        <Invites />
      </div>
    </div>
  )
}

export default EditEmployees
