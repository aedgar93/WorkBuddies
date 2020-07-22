// eslint-disable-next-line no-unused-vars
import React from 'react';
import styles from './Checkbox.module.css'

const Checkbox = ({ id, checked, onChange}) => {

  return (
    <div className={styles.checkboxContainer}>
      <span className={checked ? styles.checked : styles.noCheck} onClick={() => onChange(!checked)}></span>
      <input id={id} checked={checked} type="checkbox" onChange={e => onChange(e.target.checked)} className={styles.checkInput}/>
      <label htmlFor={id}>{ checked ? 'On' : 'Off'}</label>
    </div>
  );
}

export default Checkbox
