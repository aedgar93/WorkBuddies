// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react';
import { withFirebase } from '../../firebaseComponents'
import { withAuth } from '../../session'
import styles from './EditEmployees.module.css'
import UserCard from '../../shared/userCard'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Spinner from 'react-bootstrap/Spinner'

class EditEmployees extends Component {

  constructor(props) {
    super(props)
    this.state = {
      users: null,
      invites: null
    }
  }

  componentDidMount() {
    this.props.firebase.db.collection('users').where('company_uid', '==', this.props.auth.companyRef.id).get()
    .then(snapshot => {
      let users = []
      snapshot.forEach(user => users.push(user.data()))
      this.setState({ users })
    })

    this.props.firebase.db.collection('invites').where('company_uid', '==', this.props.auth.companyRef.id).get()
    .then(snapshot => {
      let invites = []
      snapshot.forEach(invite => invites.push(invite.data()))
      this.setState({ invites })
    })
  }


  render() {
    const { users, invites } = this.state
    return (
      <div className={styles.wrapper}>
        <div className={styles.section}>
          <h2>Employees</h2>
            { users ?
              <Row>
                { users.map((user, i) => {
                  return (
                    <Col xs={12} s={6} m={6} l={6} xl={6} key={i} className={styles.user}>
                      <UserCard email={user.email} firstName={user.firstName} lastName={user.lastName}/>
                    </Col>
                    )
                }) }
              </Row> :
              <div className={styles.loadingContainer}><Spinner animation="border" size="lg" variant="primary"/></div>
              }
        </div>

        <div className={styles.section}>
          <h2>Invites</h2>
          <div>
            { invites ?
              invites.map(invite => {
                return (<div key={invite.email}>{invite.email}</div>)
              }) :
              <div className={styles.loadingContainer}><Spinner animation="border" size="lg" variant="primary"/></div>
              }

          </div>
        </div>
      </div>
    )
  }
}

export default withAuth(withFirebase(EditEmployees))
