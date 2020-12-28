import React, { useState} from 'react';
import { Form, Col, Row } from 'react-bootstrap';
import styles from './CompanyForm.module.css'
import moment from 'moment-timezone'
import AutosaveInput from '../autosaveInput'

const hours = [
  { label: 'Morning', value: 9 },
  { label: 'Noon', value: 12 },
  { label: 'Evening', value: 17 },
]

const days = [
  { label: 'Monday', value: 1 },
  { label: 'Tuesday', value: 2 },
  { label: 'Wednesday', value: 3 },
  { label: 'Thursday', value: 4 },
  { label: 'Friday', value: 5 },
  { label: 'Saturday', value: 6 },
  { label: 'Sunday', value: 7 },
]

const CompanyForm = (props) => {
  const [name, setName] = useState(props.name ? props.name : '')
  const [hour, setHour] = useState(props.hour ? props.hour : 9)
  const [day, setDay] = useState(props.day ? props.day : 1)
  const [timeZone, setTimeZone] = useState(props.timeZone ? props.timeZone : moment.tz.guess())

  const onSubmit = (updatedValues) => {
    let values = {name, hour, day, timeZone, ...updatedValues}
    return props.onSubmit(values)
  }

  const handleNameSave = (updatedName) => {
    return props.onSubmit({name: updatedName})
  }

  return (
    <div className={styles.wrapper}>
      <Form>
        <Form.Group controlId="name">
          <Form.Label className={styles.label}>Company Name</Form.Label>
          <AutosaveInput
            className={styles.input}
            value={name}
            name="name"
            onChange={e => setName(e.target.value)}
            onSave={handleNameSave}
            required
            placeholder="Company Name" />
        </Form.Group>
        <Form.Group>
          <Form.Label className={styles.label}>Match up Time</Form.Label>
          <div className={styles.subtext}>Please select a time for buddies to be matched up.</div>
          <Row>
            <Col xs={12} s={4} m={4} l={4} xl={4} className={styles.timeColumn}>
              <Form.Control
                value={day}
                name="day"
                onChange={e => {
                  let day = Number.parseInt(e.target.value)
                  setDay(day)
                  onSubmit({day})
                }}
                required
                as="select"
                className={styles.select}
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
                onChange={e => {
                  let hour = Number.parseInt(e.target.value)
                  setHour(hour)
                  onSubmit({hour})
                }}
                required
                as="select"
                className={styles.select}
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
                onChange={e => {
                  let timeZone = e.target.value
                  setTimeZone(timeZone)
                  onSubmit({timeZone})
                }}
                required
                as="select"
                className={styles.select}
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
        {
          props.children
        }
      </Form>
    </div>
  )

}

export default CompanyForm
