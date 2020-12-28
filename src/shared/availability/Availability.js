// eslint-disable-next-line no-unused-vars
import React from 'react';
import { DAYS, TIMES } from 'wb-utils/constants'
import styles from './Availability.module.css'

const weekdays = [...DAYS].splice(0, 5)

const Availability = ({ user }) => {

  return (
    <div>
      <div className={styles.title}>Availability</div>
      <div className={styles.week}>
        { weekdays.map((day, index) => {
          return (
          <div key={day.label} className={styles.day}>
            <div className={styles.label}>{day.label}</div>
            {
              user && user.availability ? user.availability[index].times.map((time, j) => {
                let timeObj = TIMES.find(t => t.value === time)
                let label = timeObj ? timeObj.label : " -- "
                return (
                <div className={styles.timeContainer} key={`${index}_${j}`}>{label}</div>
                )
              })
              : (
                <>
                  <div className={styles.timeContainer} key={`${index}_0`}>--</div>
                  <div className={styles.timeContainer} key={`${index}_1`}>--</div>
                </>
              )
            }
          </div>
        )})}
      </div>
    </div>
  );
}

export default Availability
