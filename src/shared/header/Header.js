// eslint-disable-next-line no-unused-vars
import React, {
   useContext
} from 'react';
import { AuthUserContext } from '../../session'
import {FirebaseContext} from '../../firebaseComponents'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Button from 'react-bootstrap/Button'
import { ROUTES } from '../../utils/constants'



const Header = () => {
  let auth = useContext(AuthUserContext)
  let firebase = useContext(FirebaseContext)

  const signOut = () => {
    firebase.signOut()
  }

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Navbar.Brand href={ROUTES.BASE}>Work Buddies</Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href={ROUTES.BASE}>Home</Nav.Link>
          { auth && auth.user && auth.user.admin ? <Nav.Link href={ROUTES.EDIT_COMPANY}>My Company</Nav.Link> : null}
        </Nav>
      </Navbar.Collapse>
      { auth ? <Button onClick={signOut} variant="outline-light">Sign Out</Button> : null }
    </Navbar>
  )
}

export default Header
