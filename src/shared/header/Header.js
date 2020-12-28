// eslint-disable-next-line no-unused-vars
import React, {
   useContext, useState
} from 'react';
import {
  Link, useHistory, useLocation
} from 'react-router-dom';
import { AuthUserContext } from '../../session'
import { FirebaseContext } from '../../firebaseComponents'
import { Navbar, Nav } from 'react-bootstrap'
import { ROUTES } from 'wb-utils/constants'
import logo from '../../assets/images/logo.svg'
import logo_small from '../../assets/images/logo_small.svg'
import styles from './Header.module.css'
import Media from 'react-media';
import Button from 'react-bootstrap/Button'
import ProfilePic from '../profilePic'


const Header = () => {
  const history = useHistory()
  const location = useLocation()
  const auth = useContext(AuthUserContext)
  const firebase = useContext(FirebaseContext)
  const [profileOpen, setProfileOpen] = useState(null)

  const signOut = () => {
    firebase.signOut()
    .then(() => {
      history.push(ROUTES.BASE)
    })
  }

  return (
    <Navbar className={styles.navBar} variant="light" expand="lg">
      <Navbar.Brand to={ROUTES.BASE} as={Link} className={styles.logoContainer}>
      <Media query={{ maxWidth: 480 } }>
          {matches =>
            matches ? (
              <img src={logo_small} className={styles.logo} alt="Work Buddies logo"/>
              ) : (
              <img src={logo} className={styles.logo} alt="Work Buddies logo"/>
            )
          }
        </Media>
      </Navbar.Brand>
      <Navbar.Toggle />
      {
        auth && auth.waitingForAuth ? null :
        <Navbar.Collapse className={styles.nav}>
          <Nav>
            {
              auth && auth.user ?
              <>
                <Nav.Link to={ROUTES.BASE} as={Link} className={`${styles.navLink} ${location.pathname === '/' ? styles.active : ''}`}>Home</Nav.Link>
                { auth && auth.user && auth.user.admin ?
                  <Nav.Link to={ROUTES.EDIT_COMPANY} as={Link} className={`${styles.navLink} ${location.pathname === ROUTES.EDIT_COMPANY ? styles.active : ''}`}>My Company</Nav.Link>
                  : null
                }
                <Media query={{maxWidth: 991}}>
                  { matches => matches ?
                    <>
                      <Nav.Link to={ROUTES.MY_ACCOUNT} as={Link} className={`${styles.navLink} ${location.pathname === ROUTES.MY_ACCOUNT ? styles.active : ''}`}>Profile</Nav.Link>
                      <Nav.Link onClick={signOut} className={styles.navLink}>Log Out</Nav.Link>
                    </>
                  :
                  ( <div className={`${styles.profile} ${location.pathname === ROUTES.MY_ACCOUNT ? styles.activeProfile : ''}`} onClick={() => setProfileOpen(!profileOpen)}>
                    <ProfilePic user={auth.user} size={27} active={location.pathname === ROUTES.MY_ACCOUNT}/>
                    <div className={`${styles.profileOptions} ${profileOpen ? styles.profileOptionsOpen : ''}`} >
                      <Nav.Link as={Link} to={ROUTES.MY_ACCOUNT} className={`${location.pathname === ROUTES.MY_ACCOUNT ? styles.active : ''}`}>Profile</Nav.Link>
                      <Nav.Link onClick={signOut}>Log Out</Nav.Link>
                    </div>
                  </div> )
                }
                </Media>
              </>
              :
              <>
                <Button as={Button}  className={styles.signUp} href={ROUTES.GET_STARTED}>Sign Up</Button>
                <Nav.Link as={Link} to={ROUTES.SIGN_IN} className={`${styles.navLink} ${styles.login}`}>Login</Nav.Link>
              </>
            }
          </Nav>
        </Navbar.Collapse>
      }
    </Navbar>
  )
}

export default Header
