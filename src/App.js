import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';
import './App.css';
import { ROUTES } from 'wb-utils/constants'
import SignIn from './pages/signIn'
import AcceptInvite from './pages/acceptInvite'
import EditCompany from './pages/editCompany'
import Header from './shared/header'
import Footer from './shared/footer'
import { AuthUserContext } from './session'
import { withFirebase } from './firebaseComponents'
import Dashboard from './pages/dashboard'
import EditAccount from './pages/editAccount'
import { Spinner } from 'react-bootstrap'
import CreateCompany from './pages/createCompany';
import SetUpEmployees from './pages/setUpEmployees';
import LandingPage from './pages/landingPage';
import Welcome from './pages/welcome'
import ScrollToTop from './shared/scrollToTop'
import { withTracking } from './tracking'
import CookieBanner from './shared/cookies'
import PrivacyPolicy from './pages/privacy'
import TermsOfUse from './pages/terms'
import MSRedirect from './pages/msRedirect'


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authUser: {waitingForAuth: true},
      loading: true
    };
  }

  componentDidMount() {
    this.props.tracking.mixpanel.track('App Open')
    let findAuthListener
    this.listener = this.props.firebase.auth.onAuthStateChanged(async authUser => {
      if (authUser) {
        this.setState({ authUser : { waitingForAuth: true }})
        if (this.props.firebase.creatingUserPromise) await this.props.firebase.creatingUserPromise
        findAuthListener =this.props.firebase.db.collection('users').where('auth_id', '==', authUser.uid)
        .onSnapshot(snapshot => {
          if(!snapshot || !snapshot.docs || snapshot.docs.length === 0) return
          authUser.user = snapshot.docs[0].data()
          let id = snapshot.docs[0].id
          authUser.user.id = id
          this.props.tracking.initUser(authUser.user)

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
    this.listener && this.listener();
  }

  render() {
    const { authUser, loading } = this.state
    return (
      <AuthUserContext.Provider value={this.state.authUser}>
        <div className="App">
          <>
            <Router>
              <ScrollToTop>
                <Header />
                <div className="content">
                  {
                    loading ? <div style={{marginTop: '50px'}}><Spinner animation="border" size="lg" variant="primary"/></div> :

                      <Switch>
                          { /* Unauth Routes */}
                          { !authUser ? <Route path={ROUTES.SIGN_IN} component={SignIn}></Route> : null}
                          { !authUser ? <Route path={ROUTES.ACCEPT_INVITE} component={AcceptInvite}></Route> : null }
                          { !authUser ? <Route path={ROUTES.GET_STARTED} component={CreateCompany}></Route> : null}

                          { /* Auth Routes */}
                          { authUser ? <Route path={ROUTES.MY_ACCOUNT} component={EditAccount}></Route> : null}

                          { /* Admin Routes */ }
                          { authUser && authUser.user && authUser.user.admin ? <Route path={ROUTES.EDIT_COMPANY} component={EditCompany}></Route> : null}
                          { authUser && authUser.user && authUser.user.admin ? <Route path={ROUTES.SET_UP_EMPLOYEES} component={SetUpEmployees}></Route> : null}

                          <Route path={ROUTES.WELCOME} component={Welcome}></Route> { /* Allow users to hit this page, in case they are in the process of being logged in */ }

                          <Route path={ROUTES.PRIVACY} component={PrivacyPolicy}></Route>
                          <Route path={ROUTES.TERMS} component={TermsOfUse}></Route>
                          <Route path={ROUTES.REDIRECT} component={MSRedirect}></Route>

                          { /* Default */ }
                          { authUser ? <Route component={Dashboard}></Route> : <Route component={LandingPage}></Route> }
                      </Switch>
                  }
                </div>
                <Footer />
                <CookieBanner />
              </ScrollToTop>
            </Router>
          </>
        </div>
      </AuthUserContext.Provider>
    );
  }
}


export default withTracking(withFirebase(App));
