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


class EditCompany extends Component {

  constructor(props) {
    super(props)
    this.state = {
      activityRefs: null,

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
        <div className={styles.section}>
          <div className={styles.companySection}>
            <div className={styles.companyLabel}>My Company</div>
            <CompanyForm
              name={this.props.auth.company.name}
              day={this.props.auth.company.day}
              hour={this.props.auth.company.hour}
              timeZone={this.props.auth.company.timeZone ? this.props.auth.company.timeZone : moment.tz.guess()}
              onSubmit={this.onSubmit}></CompanyForm>
          </div>
        </div>
        <div className={styles.section}>
          <div className={styles.activitySection}>
            <div className={styles.label}>Activities</div>
            <div className={styles.activities}>
              {
                !activityRefs ? <div>Loading... </div> :
                <EditActivities onDelete={this.handleActivityDelete} onAdd={this.handleAddActivity} activities={activities}/>
              }
            </div>
          </div>
        </div>


        <div className={styles.section}>
          <div className={styles.employeeSection}>
            <div className={styles.label}>Manage Buddies</div>
            <div className={styles.editEmployees}>
              <EditEmployees />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default withTracking(withAuth(withFirebase(EditCompany)))
