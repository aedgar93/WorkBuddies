// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react';
import { withFirebase } from '../../firebaseComponents'
import { withAuth } from '../../session'
import styles from './EditEmployees.module.css'
import UserCard from '../../shared/userCard'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Spinner from 'react-bootstrap/Spinner'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

class EditEmployees extends Component {

  constructor(props) {
    super(props)
    this.state = {
      userRefs: null,
      inviteRefs: null,
      invitedEmail: ""
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount() {
    this.usersListener = this.props.firebase.db.collection('users').where('company_uid', '==', this.props.auth.companyRef.id)
    .onSnapshot(snapshot => {
      this.setState({ userRefs: snapshot.docs })
    })

    this.invitesListener = this.props.firebase.db.collection('invites').where('company_uid', '==', this.props.auth.companyRef.id)
    .onSnapshot(snapshot => {
      this.setState({ inviteRefs: snapshot.docs })
    })
  }

  componentWillUnmount() {
    this.usersListener()
    this.invitesListener()
  }

  handleSubmit(event) {
    event.preventDefault()
    const form = event.currentTarget;
    if (form.checkValidity() === false) return

    const email = this.state.invitedEmail
    this.setState({addingUser: true})
    this.props.firebase.db.collection('invites').add({
      email: email,
      company_uid: this.props.auth.companyRef.id
    }).then(result => {
        this.setState({addingUser: false, invitedEmail: ""})
    }).catch(_error => {
      //TODO: error
      this.setState({ addingUser: false })
    })
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value})
  }


  render() {
    const { userRefs, inviteRefs, addingUser, invitedEmail } = this.state
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
          <div>
            {
              inviteRefs ?
                <>
                  <Form onSubmit={this.handleSubmit}>
                    <div className={styles.inviteForm}>
                      <Form.Control type="email" required placeholder="Enter an email" name="invitedEmail" className={styles.addInput} onChange={this.handleChange} value={invitedEmail}/>
                      <Button className={styles.addButton} type="submit">
                        {
                          addingUser ?
                          <Spinner
                              className={styles.buttonSpinner}
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                            />
                          : null
                        }
                        Add
                      </Button>
                    </div>
                  </Form>
                  {
                    inviteRefs.map(ref => {
                      let invite = ref.data()
                      return (<div key={invite.email}>{invite.email}</div>)
                    })
                  }
                </>
                :
                <div className={styles.loadingContainer}><Spinner animation="border" size="lg" variant="primary" /></div>
            }

          </div>
        </div>
      </div>
    )
  }
}

export default withAuth(withFirebase(EditEmployees))
