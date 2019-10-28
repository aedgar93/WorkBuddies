// eslint-disable-next-line no-unused-vars
import React, {
   useContext
} from 'react';
import {
  Link
} from 'react-router-dom';
import { AuthUserContext } from '../../session'
import {FirebaseContext} from '../../firebaseComponents'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Dropdown from 'react-bootstrap/Dropdown'
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
      <Navbar.Brand to={ROUTES.BASE} as={Link}>Work Buddies</Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link to={ROUTES.BASE} as={Link}>Home</Nav.Link>
          { auth && auth.user && auth.user.admin ?
            <Dropdown>
              <Dropdown.Toggle as={Nav.Link}>My Company</Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item as="span"><Link to={ROUTES.EDIT_COMPANY}>Info</Link></Dropdown.Item>
                <Dropdown.Item as="span"><Link to={ROUTES.EDIT_EMPLOYEES}>Employees</Link></Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            : null
          }
        </Nav>
      </Navbar.Collapse>
      { auth ? <Button onClick={signOut} variant="outline-light">Sign Out</Button> : null }
    </Navbar>
  )
}

export default Header