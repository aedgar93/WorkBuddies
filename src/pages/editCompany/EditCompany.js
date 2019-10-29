// eslint-disable-next-line no-unused-vars
import React, { useContext, useState, Component } from 'react';
import styles from './EditCompany.module.css'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import { withFirebase } from '../../firebaseComponents'
import { withAuth } from '../../session'
import moment from 'moment-timezone'
import Activity, { EditActivity } from '../../shared/activity'

const hours = [
  { label: '12 a.m.', value: 0},
  { label: '1 a.m.', value: 1},
  { label: '2 a.m.', value: 2},
  { label: '3 a.m.', value: 3},
  { label: '4 a.m.', value: 4},
  { label: '5 a.m.', value: 5},
  { label: '6 a.m.', value: 6},
  { label: '7 a.m.', value: 7},
  { label: '8 a.m.', value: 8},
  { label: '9 a.m.', value: 9},
  { label: '10 a.m.', value: 10},
  { label: '11 a.m.', value: 11},
  { label: '12 p.m.', value: 12},
  { label: '1 p.m.', value: 13},
  { label: '2 p.m.', value: 14},
  { label: '3 p.m.', value: 15},
  { label: '4 p.m.', value: 16},
  { label: '5 p.m.', value: 17},
  { label: '6 p.m.', value: 18},
  { label: '7 p.m.', value: 19},
  { label: '8 p.m.', value: 20},
  { label: '9 p.m.', value: 21},
  { label: '10 p.m.', value: 22},
  { label: '11 p.m.', value: 23},
]

const days = [
  {label: 'Sunday', value: 0},
  {label: 'Monday', value: 1},
  {label: 'Tuesday', value: 2},
  {label: 'Wednesday', value: 3},
  {label: 'Thursday', value: 4},
  {label: 'Friday', value: 5},
  {label: 'Saturday', value: 6},
]

class EditCompany extends Component {

  constructor(props) {
    super(props)
    this.state = {
      validated: true,
      loading: false,
      name: this.props.auth.company.name,
      day: 'Monday',
      hour: 9,
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

    ref.ref.set({
      name,
      icon: icon ? icon : null
    })

    this.setState({ editIndex: -1 })
  }

  handleActivityDelete() {

  }

  render() {
    const { validated, name, timeZone, hour, day, loading, activities, editIndex } = this.state

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
            <Form.Group>
            <Row>
              <Col xs={12} s={4} m={4} l={4} xl={4} className={styles.timeColumn}>
                <Form.Control
                  value={day}
                  name="day"
                  onChange={this.onChange}
                  required
                  as="select"
                  placeholder="Select a day">
                    {
                      days.map(day => {
                        return (<option key={day.value} value={day.value}>{day.label}</option>)
                      })
                    }
                </Form.Control>
              </Col>
              <Col xs={12} s={4} m={4} l={4} xl={4} className={styles.timeColumn}>
                <Form.Control
                  value={hour}
                  name="hour"
                  onChange={this.onChange}
                  required
                  as="select"
                  placeholder="Select a time">
                    {
                      hours.map(time => {
                        return (<option key={time.value} value={time.value}>{time.label}</option>)
                      })
                    }
                </Form.Control>
              </Col>
              <Col xs={12} s={4} m={4} l={4} xl={4} className={styles.timeColumn}>
                <Form.Control
                  value={timeZone}
                  name="timeZone"
                  onChange={this.onChange}
                  required
                  as="select"
                  placeholder="Select your timezone">
                    {
                      moment.tz.names().map(zone => {
                        return (<option key={zone} value={zone}>{zone}</option>)
                      })
                    }
                </Form.Control>
              </Col>
            </Row>
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
