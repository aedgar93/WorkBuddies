import app from 'firebase/app';
import 'firebase/auth';

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
};

class Firebase {
  constructor() {
    app.initializeApp(config);

    this.auth = app.auth();
  }

  createUserWithEmailAndPassword = (email, password) =>
  Firebase.auth.createUserWithEmailAndPassword(email, password);

  signInWithEmailAndPassword = (email, password) =>
    Firebase.auth.signInWithEmailAndPassword(email, password);

  signOut = () => Firebase.auth.signOut();

  passwordReset = email => this.auth.sendPasswordResetEmail(email);

  passwordUpdate = password =>
    this.auth.currentUser.updatePassword(password);


}
export default Firebase;

