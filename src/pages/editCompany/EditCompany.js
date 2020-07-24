// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react';
import styles from './EditCompany.module.css'
import { withFirebase } from '../../firebaseComponents'
import { withAuth } from '../../session'
import moment from 'moment-timezone'
import EditActivities from '../../shared/editActivities'
import CompanyForm from '../../shared/companyForm';
import EditEmployees from '../../shared/editEmployees'
import { withTracking } from '../../tracking'
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

const SECTIONS = {
  INFO: 0,
  ACTIVITIES: 1,
  MANAGE: 2,
  INVITE: 3
}

class EditCompany extends Component {

  constructor(props) {
    super(props)
    this.state = {
      activityRefs: null,
      activeSection: SECTIONS.INFO

    }
    this.onSubmit = this.onSubmit.bind(this)
    this.handleActivityEdit = this.handleActivityEdit.bind(this)
    this.handleActivityDelete = this.handleActivityDelete.bind(this)
    this.handleAddActivity = this.handleAddActivity.bind(this)
  }

  componentDidMount() {
    this.listener = this.props.auth.companyRef.collection('activities')
    .onSnapshot(snapshot => {
      this.setState({ activityRefs: snapshot.docs })
    })
  }

  componentWillUnmount() {
    this.listener()
  }

  onSubmit(props) {
    this.props.tracking.updateCompany()
    return this.props.auth.companyRef.update(props)
  }

  handleActivityEdit(index, {name}) {
    this.props.tracking.editActivity(name)
    window.localStorage.setItem('activitiesUpdated_'+ this.props.auth.company.id, true)
    let ref = this.state.activityRefs[index]

    ref.ref.set({
      name
    })
  }

  updateSection(section) {
    this.setState({ activeSection: section})
  }

  handleActivityDelete(index) {
    window.localStorage.setItem('activitiesUpdated_'+ this.props.auth.company.id, true)
    // eslint-disable-next-line no-restricted-globals
    if(confirm('Are you sure you want to delete this activity?')) {
      let ref = this.state.activityRefs[index]
      this.props.tracking.deleteActivity(ref.data().name)
      ref.ref.delete()
    }

  }

  handleAddActivity(name) {
    this.props.tracking.addActivity(name)
    window.localStorage.setItem('activitiesUpdated_'+ this.props.auth.company.id, true)
    this.props.auth.companyRef.collection('activities').add({
      name
    }).then(ref => {
      this.setState({adding: null})
    })
  }
  render() {
    const { activityRefs } = this.state
    const activities = activityRefs ? activityRefs.map(activity => activity.data()) : []

    return (
      <div className={styles.wrapper}>
        <Container fluid={true}>
          <Row>
            <Col md={3}>
              <div className={styles.nav}>
                <button className={`${styles.navButton} ${this.state.activeSection === SECTIONS.INFO ? styles.navButtonActive : ''}`} onClick={() => this.updateSection(SECTIONS.INFO)}>Information</button>
                <button className={`${styles.navButton} ${this.state.activeSection === SECTIONS.ACTIVITIES ? styles.navButtonActive : ''}`} onClick={() => this.updateSection(SECTIONS.ACTIVITIES)}>Activities</button>
                <button className={`${styles.navButton} ${this.state.activeSection === SECTIONS.MANAGE ? styles.navButtonActive : ''}`} onClick={() => this.updateSection(SECTIONS.MANAGE)}>Buddies</button>
                <button className={`${styles.navButton} ${this.state.activeSection === SECTIONS.INVITE ? styles.navButtonActive : ''}`} onClick={() => this.updateSection(SECTIONS.INVITE)}>Invite Buddies</button>

              </div>
            </Col>
            <Col md={8} lg={8} xl={6}>
              {(
                () => {
                  switch(this.state.activeSection) {
                    case SECTIONS.INFO:
                      return (
                        <div className={styles.infoSection}>
                          <div className={styles.sectionLabel}>Information</div>
                          <CompanyForm
                            name={this.props.auth.company.name}
                            day={this.props.auth.company.day}
                            hour={this.props.auth.company.hour}
                            timeZone={this.props.auth.company.timeZone ? this.props.auth.company.timeZone : moment.tz.guess()}
                            onSubmit={this.onSubmit}></CompanyForm>
                      </div>
                      )
                    case SECTIONS.ACTIVITIES:
                      return (
                        <div className={styles.section}>
                          <div className={styles.sectionLabel}>Activities</div>
                          <div className={styles.activities}>
                            {
                              !activityRefs ? <div>Loading... </div> :
                              <EditActivities onDelete={this.handleActivityDelete} onAdd={this.handleAddActivity} activities={activities}/>
                            }
                          </div>
                        </div>
                      )
                    case SECTIONS.MANAGE:
                      return (
                        <div className={styles.section}>
                          <div className={styles.sectionLabel}>Buddies</div>
                          <div className={styles.editEmployees}>
                            <EditEmployees showInvites={false}/>
                          </div>
                        </div>
                      )
                    case SECTIONS.INVITE:
                      return (
                        <div className={styles.section}>
                        <div className={styles.sectionLabel}>Invite Buddies</div>
                        <div className={styles.editEmployees}>
                          <EditEmployees showEmployees={false}/>
                        </div>
                      </div>
                      )
                    default:
                      return null
                  }
                }
              )()}

            </Col>
          </Row>
        </Container>
      </div>
    )
  }
}

export default withTracking(withAuth(withFirebase(EditCompany)))
