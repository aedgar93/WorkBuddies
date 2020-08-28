// eslint-disable-next-line no-unused-vars
import React from 'react';
import styles from './Checkbox.module.css'

const Checkbox = ({ id, checked, onChange, hideLabel, size}) => {
  let checkboxStyle = {}
  let containerStyle = {}
  if(size) {
    checkboxStyle.width = size + 'px'
    checkboxStyle.height = size + 'px'
    containerStyle.paddingLeft = size + 'px'
  }

  return (
    <div className={styles.checkboxContainer} style={containerStyle}>
      <span className={checked ? styles.checked : styles.noCheck} onClick={() => onChange(!checked)} style={checkboxStyle}></span>
      <input id={id} checked={checked} type="checkbox" onChange={e => onChange(e.target.checked)} className={styles.checkInput}/>
      { hideLabel ? null : <label htmlFor={id}>{ checked ? 'On' : 'Off'}</label> }
    </div>
  );
}

export default Checkbox
