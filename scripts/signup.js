// The size of the cart. Number of items in the cart.
var cartSize = 0;

$("#submit").on("click", function (event) {
  console.log( document.getElementById("email").value);
   db.collection("accounts").doc().set({
     email: document.getElementById("email").value,
    firstname: document.getElementById("fname").value,
    lastname: document.getElementById("lname").value,
    phone: document.getElementById("num").value,
    password: document.getElementById("password").value,

  });
  location.href = "/signup_succeed.html"
  //db.collection("accounts").doc("EthanWinters").update({
  //fieldName: true / false
  // });
});