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
import Header from './shared/header'
import { AuthUserContext } from './session'
import { withFirebase } from './firebaseComponents'
import Dashboard from './pages/dashboard'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authUser: null,
      loading: true
    };
  }
  componentDidMount() {
    this.listener = this.props.firebase.auth.onAuthStateChanged(authUser => {
      if (authUser) {
        this.props.firebase.db.collection('users').where('auth_id', '==', authUser.uid).get()
        .then(snapshot => {
          authUser.user = snapshot.docs[0].data()
          this.setState({ authUser, loading: false })
        })
      } else {
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
          {
            loading ?
              <div>Loading ...</div>
              :
              <>
                <Header />
                <div className="content">
                  <Router>
                    <Switch>
                        <Route path={ROUTES.SIGN_UP} component={SignUp}></Route>
                        { authUser ? <Route component={Dashboard}></Route> : <Route component={SignIn}></Route> }
                    </Switch>
                  </Router>
                </div>
              </>
          }

        </div>
      </AuthUserContext.Provider>
    );
  }
}

export default withFirebase(App);
