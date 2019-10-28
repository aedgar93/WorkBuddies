// eslint-disable-next-line no-unused-vars
import React, { useContext, useState, Component } from 'react';
import styles from './EditCompany.module.css'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { withFirebase } from '../../firebaseComponents'
import { withAuth } from '../../session'
import moment from 'moment-timezone'
import Activity, { EditActivity } from '../../shared/activity'

class EditCompany extends Component {

  constructor(props) {
    super(props)
    this.state = {
      validated: true,
      loading: false,
      name: this.props.auth.company.name,
      timeZone: this.props.auth.company.timeZone ? this.props.auth.company.timeZone : moment.tz.guess(),
      activities: null,
      activityRefs: null,
      loadingActivies: true,
      editIndex: -1
    }
    this.onChange = this.onChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.handleActivitySave = this.handleActivitySave.bind(this)
    this.handleActivityDelete = this.handleActivityDelete.bind(this)
  }

  componentDidMount() {
    this.props.auth.companyRef.collection('activities').get()
    .then(snapshot => {
      let activityRefs = []
      let activities = []
      snapshot.forEach(doc => {
        activityRefs.push(doc)
        activities.push(doc.data())
      })
      this.setState({ activities, activityRefs })
    })
  }

  onSubmit(event) {
    event.preventDefault()
  }

  onChange(event) {
    this.setState({ [event.target.name]: event.target.value}, () => {
      let validated = this.state.name !== '' && this.state.timeZone
      this.setState({ validated })
    })
  }

  handleActivitySave(name, icon) {
    let activity = this.state.activities[this.state.editIndex]
    let ref = this.state.activityRefs[this.state.editIndex]

    activity.name = name
    activity.icon = icon

    this.state.activityRefs[this.state.editIndex].ref.set({
      name,
      icon: icon ? icon : null
    })

    this.setState({ editIndex: -1 })
  }

  handleActivityDelete() {

  }

  render() {
    const { validated, name, timeZone, loading, activities, editIndex } = this.state

    return (
      <div className={styles.wrapper}>
        <div className={styles.section}>
          <h2>My Company</h2>
          <Form onSubmit={this.onSubmit} validated={validated}>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                value={name}
                name="name"
                onChange={this.onChange}
                required
                placeholder="Company Name" />
            </Form.Group>
            <Form.Group controlId="timezone">
              <Form.Label>Time Zone</Form.Label>
              <Form.Control
                value={timeZone}
                name="timeZone"
                onChange={this.onChange}
                required
                as="select"
                placeholder="TimeZone">
                  {
                    moment.tz.names().map(zone => {
                      return (<option key={zone} value={zone}>{zone}</option>)
                    })
                  }
              </Form.Control>
            </Form.Group>
            <div className={styles.buttonContainer}>
              <Button variant="primary" type="submit" className={styles.button} disabled={!validated || loading}>
                Submit
              </Button>
            </div>
          </Form>
        </div>
        <div className={styles.section}>
          <h2>Activities</h2>
          <div className={styles.activities}>
            {
              !activities ? <div>Loading... </div> :
              activities.map((activity, index) => {
                return index === editIndex ?
                  <EditActivity key={activity.name + index} name={activity.name} onDelete={this.handleActivityDelete} onSave={this.handleActivitySave}/> :
                  <Activity key={activity.name + index} name={activity.name} onClick={() => this.setState({editIndex: index})} />
              })
            }
          </div>
        </div>
      </div>
    )
  }
}

export default withAuth(withFirebase(EditCompany))
