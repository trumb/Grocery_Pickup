//---------------------------------------------------
// This function checks to see if the user is sign in.
// If so, then you can go to the "users" collection,
// look for this person's document id (which would be authentication 
// object ("user")'s uid, and get that document.
// Now you can grab the name, or give a personalized greeting :)
//----------------------------------------------------
function getUser(){
  firebase.auth().onAuthStateChanged(function (user) {
      if (user){
          console.log ("user is signed in");
          db.collection("users")
          .doc(user.uid)
          .get()
          .then(function(doc){
              var n = doc.data().name;
              console.log(n);
              $("#username").text(n);
          })
      }
      else {
          console.log ("no user is signed in");
      }
  })
}
