 // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
import {config} from "../info";
import firebase from "firebase"; 
var firebaseConfig = config
  // Initialize Firebase
 const firebaseApp = firebase.initializeApp(firebaseConfig);
 firebase.analytics();

  const db = firebaseApp.firestore();
  const auth = firebase.auth();
  const storage = firebase.storage();
  const storageRef = storage.ref();
  const googleProvider = new firebase.auth.GoogleAuthProvider();
  const phoneProvider = new firebase.auth.PhoneAuthProvider();
  const facebookProvider = new firebase.auth.FacebookAuthProvider();
  const twitterProvider = new firebase.auth.TwitterAuthProvider();

  export {db , auth, storage, storageRef, googleProvider, phoneProvider, facebookProvider, twitterProvider};