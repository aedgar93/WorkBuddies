// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react';
import styles from './EditCompany.module.css'
import { withFirebase } from '../../firebaseComponents'
import { withAuth } from '../../session'
import moment from 'moment-timezone'
import EditActivities from '../../shared/editActivities'
import CompanyForm from '../../shared/companyForm';


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

  onSubmit({ name, day, hour, timeZone}) {
    return this.props.auth.companyRef.set({
      name,
      day,
      hour,
      timeZone
    })
  }

  handleActivityEdit(index, {name}) {
    let ref = this.state.activityRefs[index]

    ref.ref.set({
      name
    })

  }

  handleActivityDelete(index) {
    // eslint-disable-next-line no-restricted-globals
    if(confirm('Are you sure you want to delete this activity?')) {
      let ref = this.state.activityRefs[index]
      ref.ref.delete()
    }

  }

  handleAddActivity(name) {
    this.props.auth.companyRef.collection('activities').add({
      name
    }).then(ref => {
      this.setState({adding: null})
    }).catch(error => {
      console.log(error)
    })
  }

  render() {
    const { activityRefs } = this.state
    const activities = activityRefs ? activityRefs.map(activity => activity.data()) : []

    return (
      <div className={styles.wrapper}>
        <div className={styles.section}>
          <h2>My Company</h2>
          <CompanyForm
            name={this.props.auth.company.name}
            day={this.props.auth.company.day}
            hour={this.props.auth.company.hour}
            timeZone={this.props.auth.company.timeZone ? this.props.auth.company.timeZone : moment.tz.guess()}
            onSubmit={this.onSubmit}></CompanyForm>
        </div>
        <div className={styles.section}>
          <h2>Activities</h2>
          <div className={styles.activities}>
            {
              !activityRefs ? <div>Loading... </div> :
              <EditActivities onDelete={this.handleActivityDelete} onAdd={this.handleAddActivity} activities={activities}/>
            }
          </div>
        </div>
      </div>
    )
  }
}

export default withAuth(withFirebase(EditCompany))
