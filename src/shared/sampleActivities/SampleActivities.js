// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import styles from './SampleActivities.module.css'
import suggested from '../../utils/sampleActivities'
import { Button } from 'react-bootstrap'

const SampleActivities = ({ setSelectedActivities, selectedActivities }) => {

  const toggleActivity = (activity) => {
    const all = [...selectedActivities]
    let index = all.findIndex(act => {
      return act.name === activity.name
    })

    if(index !== -1) {
      all.splice(index, 1)
    } else {
      all.push(activity)
    }

    setSelectedActivities(all)
  }

  return (
    <div className={styles.activities}>
      {
        suggested.map((activity, index) => {
          return (
            <div className={styles.activityContainer} key={activity.name + index}>
              <Button onClick={() => toggleActivity(activity)} className={`${styles.button} ${selectedActivities.findIndex(act => act.name === activity.name) > -1 ? styles.active : ""}`} bsPrefix="wb-button">{activity.name}</Button>
            </div>
          )
        })
      }
    </div>
  );
}

export default SampleActivities
