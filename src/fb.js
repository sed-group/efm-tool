
import firebase from 'firebase/app'
import 'firebase/firestore'

  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyCo-LUGrmznhVH7LGws1TEJB0aKtVk11Jo",
    authDomain: "d3-firebase-tests.firebaseapp.com",
    databaseURL: "https://d3-firebase-tests.firebaseio.com",
    projectId: "d3-firebase-tests",
    storageBucket: "d3-firebase-tests.appspot.com",
    messagingSenderId: "654390953811",
    appId: "1:654390953811:web:adf854ac8cd826b0"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
//  db.settings({ timestampsInSnapshots: true });
  
  export default db;
