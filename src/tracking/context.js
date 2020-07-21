import React from 'react';

const TrackingContext = React.createContext(null);

export const withTracking = Component => props => (
  <TrackingContext.Consumer>
    {tracking => <Component {...props} tracking={tracking} />}
  </TrackingContext.Consumer>
);

export default TrackingContext;
