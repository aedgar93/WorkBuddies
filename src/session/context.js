import React from 'react';
const AuthUserContext = React.createContext(null);

export const withAuth = Component => props => (
  <AuthUserContext.Consumer>
    {auth => <Component {...props} auth={auth} />}
  </AuthUserContext.Consumer>
);


export default AuthUserContext;
