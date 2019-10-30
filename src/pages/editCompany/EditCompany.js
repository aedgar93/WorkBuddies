// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react';
import styles from './EditCompany.module.css'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Spinner from 'react-bootstrap/Spinner'
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
      day: this.props.auth.company.day,
      hour: this.props.auth.company.hour,
      timeZone: this.props.auth.company.timeZone ? this.props.auth.company.timeZone : moment.tz.guess(),
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

  onSubmit(event) {
    event.preventDefault()
    this.setState({ loading: true })
    this.props.auth.companyRef.set({
      name: this.state.name,
      day: this.state.day,
      hour: this.state.hour,
      timeZone: this.state.timeZone
    }).then(() => {
      this.setState({ loading: false })
    })
  }

  onChange(event) {
    this.setState({ [event.target.name]: event.target.value}, () => {
      let validated = this.state.name !== '' && this.state.timeZone && this.state.day && this.state.hour
      this.setState({ validated })
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
    const { validated, name, timeZone, hour, day, loading, editIndex, adding, activityRefs } = this.state

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
                { loading ?
                  <Spinner
                      className={styles.buttonSpinner}
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                  : null }
                <span>Submit</span>
              </Button>
            </div>
          </Form>
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
