 // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
import {config} from "../info";
import firebase from "firebase/app";
import 'firebase/auth';        // for authentication
import 'firebase/storage';     // for storage
import 'firebase/database';    // for realtime database
import 'firebase/firestore';   // for cloud firestore
import 'firebase/messaging';   // for cloud messaging
import 'firebase/functions';   // for cloud functions
// import 'firebase/analytics';

var firebaseConfig = config
  // Initialize Firebase
 const firebaseApp = firebase.initializeApp(firebaseConfig);
//  firebase.analytics();

  const db = firebaseApp.firestore();
  const auth = firebase.auth();
  const storage = firebase.storage();
  const storageRef = storage.ref();
  const database = firebase.database();
  const googleProvider = new firebase.auth.GoogleAuthProvider();
  const facebookProvider = new firebase.auth.FacebookAuthProvider();
  const twitterProvider = new firebase.auth.TwitterAuthProvider();
  const githubProvider = new firebase.auth.GithubAuthProvider();

  export {db , auth, storage, storageRef, database, googleProvider, facebookProvider, twitterProvider, githubProvider};