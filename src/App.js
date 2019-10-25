import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';
import './App.css';
import { ROUTES } from './utils/constants'
import SignIn from './pages/signIn'
import { AuthUserContext } from './session'
import { withFirebase } from './firebaseComponents'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authUser: null,
    };
  }
  componentDidMount() {
    this.listener = this.props.firebase.auth.onAuthStateChanged(authUser => {
      authUser
        ? this.setState({ authUser })
        : this.setState({ authUser: null });
    });
  }

  componentWillUnmount() {
    this.listener();
  }

  render() {
    const { authUser } = this.state
    return (
      <AuthUserContext.Provider value={this.state.authUser}>
        <div className="App">
          <Router>
            <Switch>
              {authUser ? <Route></Route> : <Route component={SignIn}></Route> }
            </Switch>
          </Router>
        </div>
      </AuthUserContext.Provider>
    );
  }
}

export default withFirebase(App);
