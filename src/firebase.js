import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyB4DSOHMwE2K0mDrFwJWLtmZye-xKJvJDo",
    authDomain: "learner-a57d8.firebaseapp.com",
    databaseURL: "https://learner-a57d8.firebaseio.com",
    projectId: "learner-a57d8",
    storageBucket: "learner-a57d8.appspot.com",
    messagingSenderId: "625275265926",
    appId: "1:625275265926:web:621907e2d03dcbd9174207",
    measurementId: "G-B8MXCP2X92"
  };

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { auth, provider };
export default db;