// The size of the cart. Number of items in the cart.
var cartSize = 0;

// Create a cart when the page is loaded.
$(document).ready(function() {
  createCart();
});
$("#submit").on("click", function(event) {
  db.collection("account").doc().set({
  email: document.getElementById("email").value,
  firstname: document.getElementById("fname").value,
  lastname: document.getElementById("lname").value,
  phone: document.getElementById("num").value,
  password: document.getElementById("password").value,
  });
            
  //db.collection("accounts").doc("EthanWinters").update({
  //fieldName: true / false
  // });
  });
