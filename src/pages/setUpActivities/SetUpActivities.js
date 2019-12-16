import React, { useState, useContext } from 'react'
import Activity from '../../shared/activity'
import styles from './SetUpActivities.module.css'
import EditActivities from '../../shared/editActivities/EditActivities'
import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'
import { AuthUserContext } from '../../session'
import { ROUTES } from '../../utils/constants'

const suggested = [
  {
    name: "Grab a Coffee",
    icon: ""
  },
  {
    name: "Ping Pong",
    icon: ""
  },
  {
    name: "Go for a Walk",
    icon: ""
  },
  {
    name: "Foosball",
    icon: ""
  },
  {
    name: "Video Games",
    icon: ""
  }
]

const SetUpActivities = ({ history }) => {
  const [selectedActivities, setSelectedActivities] = useState([])
  const [customActivities, setCustomActivities] = useState([])
  const [loading, setLoading] = useState(false)
  const [ error, setError ] = useState(false)
  const auth = useContext(AuthUserContext)

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

  const addCustom = (activity) => {
    let acts = [...customActivities]
    acts.push(activity)
    setCustomActivities(acts)
  }

  const editCustom = (index, {name, icon}) => {
    let acts = [...customActivities]
    acts[index].name = name
    acts[index].icon = icon
    setCustomActivities(acts)
  }

  const removeCustom = (index) => {
    let acts = [...customActivities]
    acts.splice(index, 1)
    setCustomActivities(acts)
  }

  const next = () => {
    setLoading(true)
    setError(false)
    let all = selectedActivities.concat(customActivities)
    let collection = auth.companyRef.collection('activities')
    let promises = all.map(({name, icon}) => {
      return collection.add({
        name,
        icon
      })
    })
    Promise.all(promises)
    .then(() => {
      setLoading(false)
      history.push(ROUTES.SET_UP_EMPLOYEES)
    })
    .catch(_error => {
      setLoading(false)
      setError('Something went wrong! Please try again.')
    })
  }

  return (
    <div className={styles.wrapper}>
      { error ? <Alert variant="danger">{error}</Alert> : null}
      <h3>Welcome!</h3>
      <div className={styles.desc}>
        Let's get started! Before we can start matching up buddies, you will need to add some suggested activities for your office.
        Activities should be easily available in or around your office and ideally take about 15 minutes.
        Please select a few activities from our suggestions below or add your own.
      </div>
      <div className={styles.activities}>
        {
          suggested.map((activity, index) => {
            return (
              <div className={styles.activityContainer} key={activity.name + index}>
                <Activity name={activity.name} icon={activity.icon} onClick={() => toggleActivity(activity)} selected={selectedActivities.findIndex(act => act.name === activity.name) > -1}/>
              </div>
            )
          })
        }
      </div>
      <div className={[styles.activities, styles.custom].join(" ")}>
        <EditActivities activities={customActivities} onDelete={removeCustom} onEdit={editCustom} onAdd={addCustom} alwaysSelected={true}></EditActivities>
      </div>
      <Button className={styles.next} variant="primary" onClick={next} disabled={(selectedActivities.length === 0 && customActivities.length === 0) || loading} size="lg">{loading ? "Loading...": "Next"}</Button>
    </div>
  )
}

export default SetUpActivities
