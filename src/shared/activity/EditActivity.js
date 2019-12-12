import React, { useState } from 'react'
import styles from './Activity.module.css'

const EditActivity = ({ name, icon, onDelete, onSave }) => {
  const [newName, setNewName] = useState(name);
  const [newIcon] = useState(icon);

  // const pickIcon = () => {
  //   return
  // }

  const handleDelete = () => {
      onDelete()
  }

  const handleSave = () => {
    onSave({name: newName, icon: newIcon})
  }

  return (
    <div className={[styles.card, styles.editCard].join(' ')}>
      <div className={styles.iconContainer}>
        { icon ? <img className={styles.icon} src={icon} alt="Activity Icon"/> : <div className={styles.editIcon}>Select an image</div> }
      </div>
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
