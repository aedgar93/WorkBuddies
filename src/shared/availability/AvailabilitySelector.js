// eslint-disable-next-line no-unused-vars
import React, { useContext, useState, useEffect } from 'react';
import { AuthUserContext } from '../../session'
import FirebaseContext from '../../firebaseComponents/context'
import { DAYS, TIMES } from 'wb-utils/constants'
import moment from 'moment-timezone'
import styles from './AvailabilitySelector.module.css'

const weekdays = [...DAYS].splice(0, 5)


const defaultAval = weekdays.map(day => {
  return {day: day.value, times: [null, null]}
})

const AvailabilitySelector = () => {
  const auth = useContext(AuthUserContext)
  const firebase = useContext(FirebaseContext)
  const [availability, setAvailability] = useState(auth.user.availability || defaultAval)
  const [timezone, setTimezone] = useState(auth.user.timezone ||  moment.tz.guess())

  useEffect(() => {
    //set initial timezone
    if(!auth.user.timezone) {
      firebase.db.collection('users').doc(auth.user.id).update({
        timezone: moment.tz.guess()
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleTimezoneChange = (event) => {
    setTimezone(event.currentTarget.value)
    firebase.db.collection('users').doc(auth.user.id).update({
      timezone: event.currentTarget.value
    })
  }

  const updateAvailability = (day, index, value) => {
    let avalCopy = [...availability]

    avalCopy[day - 1].times[index] = value ? parseInt(value) : null
    setAvailability(avalCopy)

    firebase.db.collection('users').doc(auth.user.id).update({
      availability: avalCopy
    })
  }

  return (
    <div>
      <div className={styles.week}>
        { weekdays.map(day => {
          return (
          <div key={day.label} className={styles.day}>
            <div className={styles.label}>{day.label}</div>
            <div className={styles.timeSelectContainer}>
              <select value={availability[day.value - 1].times[0] || ''} onChange={e => updateAvailability(day.value, 0, e.currentTarget.value)} className={styles.timeSelect}>
                <option> -- </option>
                {
                  TIMES.map(time => <option value={time.value} key={ day.label + "0" + time.label}>{time.label}</option>)
                }
              </select>
            </div>
            <div className={styles.timeSelectContainer}>
              <select value={availability[day.value - 1].times[1] || ''} onChange={e => updateAvailability(day.value, 1, e.currentTarget.value)} className={styles.timeSelect}>
                <option> -- </option>
                {
                  TIMES.map(time => <option value={time.value} key={ day.label + "0" + time.label}>{time.label}</option>)
                }
              </select>
            </div>
          </div>
        )})}
      </div>
      <div className={styles.tzSelectContainer}>
        <select value={timezone} onChange={handleTimezoneChange} className={styles.tzSelect}>
          {
            moment.tz.names().map(tz => <option key={tz}>{tz}</option>)
          }
        </select>
      </div>
    </div>
  );
}

export default AvailabilitySelector
