import React from 'react';
import ReactDOM from 'react-dom';
import './bootstrap-custom.scss';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import Firebase, { FirebaseContext } from './firebaseComponents'
import * as Sentry from '@sentry/browser';

if(!process.env.REACT_APP_DEV) Sentry.init({dsn: "https://dd692b92e63b49828f066d29a0bba831@o386021.ingest.sentry.io/5219753"});


ReactDOM.render(
  <FirebaseContext.Provider value={new Firebase()}>
    <App />
  </FirebaseContext.Provider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
