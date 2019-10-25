// eslint-disable-next-line no-unused-vars
import React, { useState, useContext } from 'react';
import styles from './SignIn.module.css'
import { FirebaseContext } from '../../firebaseComponents'
import { ROUTES } from '../../utils/constants'

const SignIn = ({ history }) => {
  let [email, setEmail] = useState('')
  let [password, setPassword] = useState('')
  let [error, setError] = useState(null)
  let [loading, setLoading] = useState(false)
  let firebase = useContext(FirebaseContext)

  const onSubmit = event => {
    setError(null)
    setLoading(true)

    firebase.signInWithEmail(email, password)
    .then(() => {
      history.push(ROUTES.BASE)
    })
    .catch(( error ) => {
      setError(error)
      setLoading(false)
    })
  }

  return (
      <form onSubmit={onSubmit}>
        <input
          name="email"
          value={email}
          onChange={val => setEmail(val)}
          type="text"
          placeholder="Email Address"
        />
        <input
          name="password"
          value={password}
          onChange={(val) => setPassword(val)}
          type="password"
          placeholder="Password"
        />
        <button disabled={password === '' || email === '' || loading} type="submit">
          Sign In
        </button>
        {error && <p>{error.message}</p>}
      </form>
    );
}

export default SignIn
