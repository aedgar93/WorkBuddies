import React from 'react';
import { withRouter } from 'react-router-dom';
import { withFirebase } from '../firebaseComponents'
import { ROUTES } from 'wb-utils/constants'

const withAuthorization = condition => Component => {
  class WithAuthorization extends React.Component {
    componentDidMount() {
      this.listener = this.props.firebase.auth.onAuthStateChanged(
        authUser => {
          if (!condition(authUser)) {
            this.props.history.push(ROUTES.BASE);
          }
        },
      );
    }
    componentWillUnmount() {
      this.listener();
    }
    render() {
      return (
        <Component {...this.props} />
      );
    }
  }
  return WithAuthorization
};
export default withFirebase(withRouter(withAuthorization));
