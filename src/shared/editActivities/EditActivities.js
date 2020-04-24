import React, { useState } from 'react'
import Activity from '../activity';
import Button from 'react-bootstrap/Button'
import styles from './EditActivities.module.css'


const EditActivities = ({ activities, onDelete, onAdd }) => {
  const [name, setName] = useState('')

  const handleDeleteActivity = (index) => {
    onDelete(index)
  }

  const handleAddActivity = (e) => {
    e.preventDefault()
    onAdd(name)
    setName('')
  }

  return (
      <>
      {
        activities.map((activity, index) => {
          return <span className={styles.activityWrapper} key={activity.name + index}><Activity name={activity.name}  onDelete={() =>  handleDeleteActivity(index)}/></span>
        })
      }
      <div className={styles.form}>
        <form onSubmit={handleAddActivity}>
          <input value={name} onChange={e => setName(e.target.value)} className={styles.input} placeholder="Enter activity"/>
          <Button type="submit" className={styles.button} size="lg">Add</Button>
        </form>
      </div>
    </>
  )
}

export default EditActivities
