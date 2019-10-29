import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';
import './App.css';
import { ROUTES } from './utils/constants'
import SignIn from './pages/signIn'
import SignUp from './pages/signUp'
import EditCompany from './pages/editCompany'
import Header from './shared/header'
import { AuthUserContext } from './session'
import { withFirebase } from './firebaseComponents'
import Dashboard from './pages/dashboard'
import EditEmployees from './pages/editEmployees/EditEmployees';
import Spinner from 'react-bootstrap/Spinner'

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
    this.listener = this.props.firebase.auth.onAuthStateChanged(authUser => {
      if (authUser) {
        this.props.firebase.db.collection('users').where('auth_id', '==', authUser.uid).get()
        .then(snapshot => {
          authUser.user = snapshot.docs[0].data()
          localStorage.setItem('authUser', JSON.stringify(authUser));
          localStorage.setItem('user', JSON.stringify(authUser.user));
          let companyRef = this.props.firebase.db.collection('companies').doc(authUser.user.company_uid)
          companyRef.get()
          .then(snapshot => {
            authUser.company = snapshot.data()
            authUser.companyRef = this.props.firebase.db.collection('companies').doc(authUser.user.company_uid)
            this.setState({ authUser, loading: false })
          })
        })
      } else {
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
                  loading ? <div><Spinner animation="border" size="lg" variant="primary"/></div>:

                    <Switch>
                        <Route path={ROUTES.SIGN_UP} component={SignUp}></Route>
                        { authUser && authUser.user.admin ? <Route path={ROUTES.EDIT_COMPANY} component={EditCompany}></Route> : null}
                        { authUser && authUser.user.admin ? <Route path={ROUTES.EDIT_EMPLOYEES} component={EditEmployees}></Route> : null}
                        { authUser ? <Route component={Dashboard}></Route> : <Route component={SignIn}></Route> }
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
