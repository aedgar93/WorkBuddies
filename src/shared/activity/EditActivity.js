import React, { useState } from 'react'
import styles from './Activity.module.css'

const EditActivity = ({ name, onDelete, onSave }) => {
  const [newName, setNewName] = useState(name);


  const handleDelete = () => {
      onDelete()
  }

  const handleSave = () => {
    onSave({name: newName })
  }

  return (
    <div className={[styles.card, styles.editCard].join(' ')}>
      <div className={styles.editName}>
        <input
          className={styles.input}
          value={newName}
          placeholder="Enter a name"
          name="name"
          onChange={e => setNewName(e.target.value)}
        />
      </div>
      <div className={[styles.action, styles.save].join(' ')} onClick={handleSave}>Save</div>
      <div className={[styles.action, styles.delete].join(' ')} onClick={handleDelete}>Delete</div>
    </div>
  )
}

export default EditActivity
