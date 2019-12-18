import React, {useState} from 'react'
import Activity, { EditActivity } from '../activity';
import Button from 'react-bootstrap/Button'
import styles from './EditActivities.module.css'


const EditActivities = ({ activities, onDelete, onEdit, onAdd, alwaysSelected }) => {
  const [adding, setAdding] = useState(null)
  const [editIndex, setEditIndex] = useState(null)

  const handleDeleteActivity = (index, activity) => {
    onDelete(index, activity)
    setEditIndex(null)
  }

  const handleEditActivity = (index, activity) => {
    onEdit(index, activity)
    setEditIndex(null)
  }

  const handleAddActivity = (name, icon) => {
    onAdd(name, icon)
    setAdding(null)
  }


  const handleOpenAdd = () => {
    setEditIndex(null)
    setAdding({name: "", icon: ""})
  }

  const handleStartEdit = (index) => {
    setEditIndex(index)
    setAdding(null)
  }

  return (
      <>
      {
        activities.map((activity, index) => {
          return index === editIndex ?
            <EditActivity key={activity.name + index} name={activity.name} icon={activity.icon} onDelete={activity => handleDeleteActivity(index, activity)} onSave={activity => handleEditActivity(index, activity)}/> :
            <span className={styles.activityWrapper} key={activity.name + index}><Activity name={activity.name} icon={activity.icon} onClick={() =>  handleStartEdit(index)} selected={alwaysSelected}/></span>
        })
      }
      {
        adding ?
        <EditActivity name={adding.name} icon={adding.icon} onDelete={() => setAdding(null)} onSave={handleAddActivity} /> :
        <Button variant="outline-success" onClick={handleOpenAdd} className={styles.addButton} >Add</Button>
      }
    </>
  )
}

export default EditActivities
