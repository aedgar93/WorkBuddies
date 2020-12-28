// eslint-disable-next-line no-unused-vars
import React, { useState, useRef } from 'react';
import { Form, Spinner } from 'react-bootstrap'
import styles from './AutosaveInput.module.css'

const AutosaveInput = ({className, name, value, onChange, placeholder, required = false, onSave, type, as, interval = 2000}) => {
  const [timer, setTimer] = useState(null)
  const [loading, setLoading] = useState(false)
  const onSaveRef = useRef(onSave)

  const handleSave = (val) => {
    if(required && !val) return
    setLoading(true)
    onSaveRef.current(val)
    .finally(() => {
      setLoading(false)
    })
  }

  return (
    <div style={{'position': 'relative'}}>
      <Form.Control
          className={className}
          type={type}
          as={as}
          name={name}
          value={value}
          placeholder={placeholder}
          required={required}
          onChange={e => {
            onChange(e)
            clearTimeout(timer)
            let val = e.target.value
            let newTimer = setTimeout(() => {
              handleSave(val)
              setTimer(null)
            }, interval)
            setTimer(newTimer)
          }}
          onBlur={_e => {
            if(timer) {
              clearTimeout(timer)
              handleSave(value)
            }
          }}
        >
        </Form.Control>
        { loading ?
          <div className={styles.spinner}>
            <Spinner animation="border"  size="sm"/>
          </div>
        : null}
      </div>
  );
}

export default AutosaveInput
