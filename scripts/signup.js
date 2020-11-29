// The sign up form.
const form = document.querySelector("#signUp");

// When the form is submitted, write to firebase auth and put an account into the users collection.
form.addEventListener("submit", event => {
  event.preventDefault();
  const email = form.email.value;
  const password = form.password.value;
  var remember_me = false;
  if (document.getElementById("remember").checked) {
    remember_me = true;
  }
  firebase.auth().createUserWithEmailAndPassword(email, password).then(token => {
    return db.collection("users").doc(token.user.uid).set({
      first_name: form.firstName.value,
      last_name: form.lastName.value,
      phone_no: form.phoneNo.value,
      remember_me: remember_me
    });
  }).then(token => {
    form.reset();
    location.href = "signup_succeed.html"
  }).catch(error => {
    console.log(error.code);
    console.log(error.message);
  });
});
$(document).ready(function(){
  $('.cancelbtn').click(function(){
    window.location.href="index.html";
  })
});
