// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react';
import styles from './EditCompany.module.css'
import Button from 'react-bootstrap/Button';
import { withFirebase } from '../../firebaseComponents'
import { withAuth } from '../../session'
import moment from 'moment-timezone'
import Activity, { EditActivity } from '../../shared/activity'
import CompanyForm from '../../shared/companyForm';


class EditCompany extends Component {

  constructor(props) {
    super(props)
    this.state = {
      activityRefs: null,
      loadingActivies: true,
      editIndex: -1,
      adding: null,

    }
    this.onChange = this.onChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.handleActivitySave = this.handleActivitySave.bind(this)
    this.handleActivityDelete = this.handleActivityDelete.bind(this)
    this.handleOpenAdd = this.handleOpenAdd.bind(this)
    this.handleAddActivity = this.handleAddActivity.bind(this)
    this.handleCancelAdd = this.handleCancelAdd.bind(this)
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

  handleActivitySave(name, icon) {
    let ref = this.state.activityRefs[this.state.editIndex]

    ref.ref.set({
      name,
      icon: icon ? icon : null
    })

    this.setState({ editIndex: -1 })
  }

  handleActivityDelete() {
    // eslint-disable-next-line no-restricted-globals
    if(confirm('Are you sure you want to delete this activity?')) {
      let ref = this.state.activityRefs[this.state.editIndex]
      ref.ref.delete()
      this.setState({editIndex: -1})
    }

  }

  handleOpenAdd() {
    this.setState({adding: {name: "", icon: null}, editIndex: -1})
  }

  handleCancelAdd() {
    this.setState({adding: null})
  }

  handleAddActivity(name, icon) {
    this.props.auth.companyRef.collection('activities').add({
      name,
      icon
    }).then(ref => {
      this.setState({adding: null})
    }).catch(error => {
      console.log(error)
    })
  }

  render() {
    const { editIndex, adding, activityRefs } = this.state

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
              activityRefs.map((ref, index) => {
                let activity = ref.data()
                return index === editIndex ?
                  <EditActivity key={activity.name + index} name={activity.name} icon={activity.icon} onDelete={this.handleActivityDelete} onSave={this.handleActivitySave}/> :
                  <Activity key={activity.name + index} name={activity.name} icon={activity.icon} onClick={() => this.setState({editIndex: index, adding: null})} />
              })
            }
            {
              adding ?
              <EditActivity name={adding.name} icon={adding.icon} onDelete={this.handleCancelAdd} onSave={this.handleAddActivity} /> :
              <Button variant="outline-success" onClick={this.handleOpenAdd} className={styles.addButton} >Add</Button>
            }
          </div>
        </div>
      </div>
    )
  }
}

export default withAuth(withFirebase(EditCompany))
