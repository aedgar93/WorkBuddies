// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Link } from 'react-router-dom'
import { ROUTES, SUPPORT_EMAIL } from 'wb-utils/constants'
import styles from './Footer.module.css'
import { withRouter } from 'react-router-dom'

const Footer = () => {
  return (
    <div className={styles.footer}>
      <div className={styles.topLinks}>
        <Link to={ROUTES.PRIVACY}>Privacy Policy</Link>
        <Link to={ROUTES.TERMS}>Terms of Use</Link>
        <a href={`mailto:${SUPPORT_EMAIL}`}>Contact Us</a>
      </div>
      © 2020 Tang Labs, LLC
    </div>
  )
}

export default withRouter(Footer)
