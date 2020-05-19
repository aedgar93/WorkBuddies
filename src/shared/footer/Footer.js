// eslint-disable-next-line no-unused-vars
import React, { useContext } from 'react';
import styles from './Footer.module.css'
import { withRouter } from 'react-router-dom'
import { AuthUserContext } from '../../session'


const Footer = ({ location }) => {
  const auth = useContext(AuthUserContext)


  return (
    <div className={`${styles.footer} ${location.pathname === '/' && (!auth || !auth.user) ? styles.home : ''}`}>
      © 2020 Tang Labs, LLC
    </div>
  )
}

export default withRouter(Footer)
