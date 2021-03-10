 // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
import firebase from "firebase"; 
var firebaseConfig = {
    apiKey: "AIzaSyCsDXcBqUkFzP7a_YLfSi1bUFV4zYv9Ipk",
    authDomain: "instagram-clone-21d9b.firebaseapp.com",
    databaseURL: "https://instagram-clone-21d9b.firebaseio.com",
    projectId: "instagram-clone-21d9b",
    storageBucket: "instagram-clone-21d9b.appspot.com",
    messagingSenderId: "766234567722",
    appId: "1:766234567722:web:6715c7b7dcae914e950f53",
    measurementId: "G-770BEE44CM"
  };
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