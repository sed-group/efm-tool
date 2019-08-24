
import firebase from 'firebase/app'
import 'firebase/firestore'

  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyBjta-SWJ-XsMvvDHHlM2WwgTTW1cib9rs",
    authDomain: "efm-tool.firebaseapp.com",
    databaseURL: "https://efm-tool.firebaseio.com",
    projectId: "efm-tool",
    storageBucket: "efm-tool.appspot.com",
    messagingSenderId: "22978628425",
    appId: "1:22978628425:web:724021813105a99d"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
//  db.settings({ timestampsInSnapshots: true });
  
  export default db;
