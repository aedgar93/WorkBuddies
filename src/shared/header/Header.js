// eslint-disable-next-line no-unused-vars
import React, {
   useContext
} from 'react';
import {
  Link
} from 'react-router-dom';
import { AuthUserContext } from '../../session'
import { FirebaseContext } from '../../firebaseComponents'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Dropdown from 'react-bootstrap/Dropdown'
import { ROUTES } from '../../utils/constants'
import { useHistory } from "react-router-dom";
import logo from '../../assets/images/logo.svg'
import styles from './Header.module.css'


const Header = () => {
  const history = useHistory()
  const auth = useContext(AuthUserContext)
  const firebase = useContext(FirebaseContext)

  const signOut = () => {
    console.log('signing out')
    firebase.signOut()
    .then(() => {
      console.log('reroute')
      history.push(ROUTES.BASE)
    })
  }

  return (
    <Navbar className={styles.navBar} variant="light" expand="lg">
      <Navbar.Brand to={ROUTES.BASE} as={Link} className={styles.logoContainer}>
        <img src={logo} className={styles.logo} alt="Work Buddies logo"/>
      </Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          {
            auth && auth.user ?
            <>
              <Nav.Link to={ROUTES.BASE} as={Link}>Home</Nav.Link>
              <Nav.Link to={ROUTES.MY_ACCOUNT} as={Link}>My Account</Nav.Link>
            </>
            : null
          }
          { auth && auth.user && auth.user.admin ?
            <Dropdown>
              <Dropdown.Toggle as={Nav.Link}>My Company</Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item as="span"><Link to={ROUTES.EDIT_COMPANY}>Info and Activities</Link></Dropdown.Item>
                <Dropdown.Item as="span"><Link to={ROUTES.EDIT_EMPLOYEES}>Employees</Link></Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            : null
          }
        </Nav>
        { auth ? <Nav.Link onClick={signOut} className={styles.navLink} bsPrefix="wb-navlink">Log Out</Nav.Link> :
          <Nav>
            <Nav.Link as={Link} to={ROUTES.SIGN_UP} className={`${styles.navLink} ${styles.signUp}`} bsPrefix="wb-navlink">Sign Up</Nav.Link>
            <Nav.Link as={Link} to={ROUTES.SIGN_IN} className={`${styles.navLink} ${styles.login}`} bsPrefix="wb-navlink">Login</Nav.Link>
          </Nav>
        }
      </Navbar.Collapse>
    </Navbar>
  )
}

export default Header
