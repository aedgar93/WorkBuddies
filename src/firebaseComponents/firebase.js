import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore'
import 'firebase/storage'

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
};

class Firebase {
  constructor(tracking) {
    app.initializeApp(config);

    this.auth = app.auth();
    this.db = app.firestore()
    this.storage = app.storage()
    this.firestore = app.firestore
    this.tracking = tracking
  }

  createUserWithEmailAndPassword = (email, password) => {
    this.tracking.signIn()
    return this.auth.createUserWithEmailAndPassword(email, password);
  }

  signInWithEmailAndPassword = (email, password) => {
    this.tracking.signIn()
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  signOut = () => this.auth.signOut();

  passwordReset = email => this.auth.sendPasswordResetEmail(email);

  passwordUpdate = password =>
    this.auth.currentUser.updatePassword(password);

  doesUserExistForEmail = async email => {
    let results = await this.auth.fetchSignInMethodsForEmail(email)
    return results && results.length > 0
  }


}
export default Firebase;

