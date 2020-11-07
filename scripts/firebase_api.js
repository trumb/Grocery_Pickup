// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyDmjD2Fjofw1hTnFPEG1XXjcg-y_IOCwUE",
  authDomain: "smarket-cb08b.firebaseapp.com",
  databaseURL: "https://smarket-cb08b.firebaseio.com",
  projectId: "smarket-cb08b",
  storageBucket: "smarket-cb08b.appspot.com",
  messagingSenderId: "228483098556",
  appId: "1:228483098556:web:20f3350eace4f73406edb9"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Create the Firestore database object
// Henceforce, any reference to the database can be made with "db"
const db = firebase.firestore();
