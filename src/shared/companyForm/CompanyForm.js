import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import styles from './CompanyForm.module.css'
import moment from 'moment-timezone'

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
  const [valid, setValid] = useState(props.name && props.name !== '' && typeof props.hour === 'number' && typeof props.day === 'number' && props.timeZone)

  const onSubmit = (event) => {
    event.preventDefault()
    props.onSubmit({name, hour, day, timeZone})
  }

  useEffect(() => {
    let valid = name && name !== '' && typeof hour === 'number' && typeof day === 'number' && timeZone
    setValid(valid)
  }, [name, hour, day, timeZone])

  return (
    <div className={styles.wrapper}>
      <Form onSubmit={onSubmit}>
        <Form.Group controlId="name">
          <Form.Label className={styles.label}>Company Name</Form.Label>
          <Form.Control
            value={name}
            name="name"
            onChange={e => setName(e.target.value)}
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
                onChange={e => setDay(Number.parseInt(e.target.value))}
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
                onChange={e => setHour(Number.parseInt(e.target.value))}
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
                onChange={e => setTimeZone(e.target.value)}
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
        {
          props.children
        }
        <div className={styles.buttonContainer}>
          <Button variant="primary" type="submit" className={styles.button} disabled={!valid}>Submit</Button>
        </div>
      </Form>
    </div>
  )

}

export default CompanyForm
