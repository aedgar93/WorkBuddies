import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Spinner from 'react-bootstrap/Spinner'
import styles from './CompanyForm.module.css'
import moment from 'moment-timezone'

const hours = [
  { label: '12 a.m.', value: 0 },
  { label: '1 a.m.', value: 1 },
  { label: '2 a.m.', value: 2 },
  { label: '3 a.m.', value: 3 },
  { label: '4 a.m.', value: 4 },
  { label: '5 a.m.', value: 5 },
  { label: '6 a.m.', value: 6 },
  { label: '7 a.m.', value: 7 },
  { label: '8 a.m.', value: 8 },
  { label: '9 a.m.', value: 9 },
  { label: '10 a.m.', value: 10 },
  { label: '11 a.m.', value: 11 },
  { label: '12 p.m.', value: 12 },
  { label: '1 p.m.', value: 13 },
  { label: '2 p.m.', value: 14 },
  { label: '3 p.m.', value: 15 },
  { label: '4 p.m.', value: 16 },
  { label: '5 p.m.', value: 17 },
  { label: '6 p.m.', value: 18 },
  { label: '7 p.m.', value: 19 },
  { label: '8 p.m.', value: 20 },
  { label: '9 p.m.', value: 21 },
  { label: '10 p.m.', value: 22 },
  { label: '11 p.m.', value: 23 },
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
  const [loading, setLoading] = useState(false)

  const onSubmit = () => {
    setLoading(true)
    props.onSubmit({name, hour, day, timeZone})
    .then(() => {
      setLoading(false)
    }).catch(error => {
      setLoading(false)
      //TODO, set error
    })
  }

  useEffect(() => {
    let valid = name && name !== '' && typeof hour === 'number' && typeof day === 'number' && timeZone
    setValid(valid)
  }, [name, hour, day, timeZone])

  return (
    <div className={styles.wrapper}>
      <Form onSubmit={onSubmit}>
        <Form.Group controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            value={name}
            name="name"
            onChange={e => setName(e.target.value)}
            required
            placeholder="Company Name" />
        </Form.Group>
        <Form.Group>
          <Form.Label>Match up Time</Form.Label>
          <div className={styles.subtext}>Please select a time for buddies to be matched up. We suggest setting a time at the beginning of your work week</div>
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
        <div className={styles.buttonContainer}>
          <Button variant="primary" type="submit" className={styles.button} disabled={!valid || loading}>
            {loading ?
              <Spinner
                className={styles.buttonSpinner}
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
              : null}
            <span>Submit</span>
          </Button>
        </div>
      </Form>
    </div>
  )

}

export default CompanyForm
