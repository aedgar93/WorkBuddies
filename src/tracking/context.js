import React from 'react';
import Tracking from './tracking'

const TrackingContext = React.createContext(null);

export const withTracking = Component => props => (
  <TrackingContext.Consumer>
    {tracking => <Component {...props} tracking={tracking} />}
  </TrackingContext.Consumer>
);


export class TrackingProvider extends React.Component{
  constructor(props) {
    super(props);
    let tracking = new Tracking()
    this.state = {
      ...tracking,
      consent: tracking.cookies.consent
    }
  }

  handleSetConsent = (consent) => {
    this.setState({consent})
    this.state.cookies.setConsent(consent)
  }


  render() {
    return (
      <TrackingContext.Provider value={{...this.state, consent: this.state.consent, setConsent: this.handleSetConsent}}>
        {this.props.children}
      </TrackingContext.Provider>
    )
  }
}

export default TrackingContext;
