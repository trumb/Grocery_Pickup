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

// Create the Firestore database object and Firebase Auth object.
// Henceforce, any reference to the database can be made with "db",
// any reference to auth can be made with "auth"
const auth = firebase.auth();
const db = firebase.firestore();

auth.setPersistence(firebase.auth.Auth.Persistence.SESSION).then(function() {
  // Existing and future Auth states are now persisted in the current
  // session only. Closing the window would clear any existing state even
  // if a user forgets to sign out.
  // ...
  // New sign-in will be persisted with session persistence.
  return firebase.auth().signInWithEmailAndPassword(email, password);
}).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
});
