import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';
import './App.css';
import { ROUTES } from './utils/constants'
import SignIn from './pages/signIn'
import AcceptInvite from './pages/acceptInvite'
import EditCompany from './pages/editCompany'
import Header from './shared/header'
import { AuthUserContext } from './session'
import { withFirebase } from './firebaseComponents'
import Dashboard from './pages/dashboard'
import EditAccount from './pages/editAccount'
import EditEmployees from './pages/editEmployees';
import Spinner from 'react-bootstrap/Spinner'
import CreateCompany from './pages/createCompany';
import SetUpEmployees from './pages/setUpEmployees';
import LandingPage from './pages/landingPage/LandingPage';

class App extends Component {
  constructor(props) {
    super(props);
    let authUser = JSON.parse(localStorage.getItem('authUser'))
    if (authUser) {
      authUser.user = JSON.parse(localStorage.getItem('user'))
    }
    this.state = {
      authUser,
      loading: true
    };
  }

  componentDidMount() {
    let findAuthListener
    this.listener = this.props.firebase.auth.onAuthStateChanged(async authUser => {
      if (authUser) {
        console.log('auth state changing!')
        this.setState({ authUser : { waitingForAuth: true }})
        if (this.props.firebase.creatingUserPromise) await this.props.firebase.creatingUserPromise
        findAuthListener =this.props.firebase.db.collection('users').where('auth_id', '==', authUser.uid)
        .onSnapshot(snapshot => {
          if(!snapshot || !snapshot.docs || snapshot.docs.length === 0) return
          authUser.user = snapshot.docs[0].data()
          authUser.user.id = snapshot.docs[0].id
          authUser.updateUser = (val) => {
            authUser.user = val.data()
            authUser.user.id = val.id
          }
          localStorage.setItem('authUser', JSON.stringify(authUser));
          localStorage.setItem('user', JSON.stringify(authUser.user));
          let companyRef = this.props.firebase.db.collection('companies').doc(authUser.user.company_uid)
          companyRef.get()
          .then(snapshot => {
            authUser.company = snapshot.data()
            authUser.companyRef = this.props.firebase.db.collection('companies').doc(authUser.user.company_uid)
            this.setState({ authUser, loading: false }, () => {
              findAuthListener()
            })
          })
        })
      } else {
        findAuthListener && findAuthListener()
        localStorage.removeItem('authUser');
        localStorage.removeItem('user');
        this.setState({ authUser: null, loading: false });
      }
    });
  }

  componentWillUnmount() {
    this.listener();
  }

  render() {
    const { authUser, loading } = this.state
    return (
      <AuthUserContext.Provider value={this.state.authUser}>
        <div className="App">
          <>
            <Router>
              <Header />
              <div className="content">
                {
                  loading ? <div><Spinner animation="border" size="lg" variant="primary"/></div> :

                    <Switch>
                        { /* Unauth Routes */}
                        { !authUser ? <Route path={ROUTES.SIGN_IN} component={SignIn}></Route> : null}
                        { !authUser ? <Route path={ROUTES.SIGN_UP} component={AcceptInvite}></Route> : null }
                        { !authUser ? <Route path={ROUTES.GET_STARTED} component={CreateCompany}></Route> : null}

                        { /* Auth Routes */}
                        { authUser ? <Route path={ROUTES.MY_ACCOUNT} component={EditAccount}></Route> : null}

                        { /* Admin Routes */ }
                        { authUser && authUser.user && authUser.user.admin ? <Route path={ROUTES.EDIT_COMPANY} component={EditCompany}></Route> : null}
                        { authUser && authUser.user && authUser.user.admin ? <Route path={ROUTES.EDIT_EMPLOYEES} component={EditEmployees}></Route> : null}
                        <Route path={ROUTES.SET_UP_EMPLOYEES} component={SetUpEmployees}></Route> { /* Allow users to hit this page, in case they are in the process of being logged in */ }

                        { /* Default */ }
                        { authUser ? <Route component={Dashboard}></Route> : <Route component={LandingPage}></Route> }
                    </Switch>
                }
              </div>
            </Router>
          </>

        </div>
      </AuthUserContext.Provider>
    );
  }
}

export default withFirebase(App);
