// The size of the cart. Number of items in the cart.
var cartSize = 0;

// Create a cart when the page is loaded.
$(document).ready(function() {
  createCart();
});

// "Empty Cart" button handler.
$("#empty").on("click", function(event) {
  cartSize = 0;
  db.collection("cart").get().then(function(snap) {
    snap.forEach(function(doc) {
      db.collection("cart").doc(doc.id).delete().then();
      document.getElementById(doc.id).remove();
    });
  });
  checkIfCartEmpty(0);
});

function createCart() {
  db.collection("cart").get().then(function(snap) {
    snap.forEach(function(doc) {
      cartSize++;
      var id = doc.id;
      var img = doc.data().img_name;
      var n = doc.data().name;
      var p = doc.data().price;
      var q = doc.data().quantity;
      $("#cart").append("<div id='" + id + "' class='d-flex flex-row align-items-center border-bottom border-primary'></div>");
      $("#" + id).append("<img class='img-fluid img-thumbnail' src='images/" + img + "' alt='" + n + "'/>");
      $("#" + id).append("<div class='container d-flex flex-column'></div>");
      $("#" + id + " div").append("<span class='d-flex justify-content-between'><h5>" + n + "</h5></span>");
      $("#" + id + " span").append("<button type='button' id='remove' class='btn btn-primary'>×</button>");
      $("#" + id + " div").append("<div class='d-flex justify-content-between'>$" + p + "</div>");
      $("#" + id + " div div").append("<div class='btn-group' role='group'></div>");
      $("#" + id + " .btn-group").append("<button id='plus' class='btn btn-primary'>+</button>");
      $("#" + id + " .btn-group").append("<span id='" + id + "q'>" + q + "</span>");
      $("#" + id + " .btn-group").append("<button id='minus' class='btn btn-primary'>−</button>");
      $("#" + id + " #remove").on("click", function(event) {
        unsubscribe();
        removeClick(id);
        cartSize--;
        checkIfCartEmpty(cartSize);
      });
      $("#" + id + " #plus").on("click", function(event) {
        plusClick(id);
      });
      $("#" + id + " #minus").on("click", function(event) {
        minusClick(id);
      });
      checkIfCartEmpty(cartSize);
      var unsubscribe = db.collection("cart").doc(id).onSnapshot(function(updated) {
        if (cartSize == 0) {
          unsubscribe();
        }
        else if (updated.data().quantity == 0) {
          unsubscribe();
          removeClick(id);
          cartSize--;
          checkIfCartEmpty(cartSize);
        } else {
          document.getElementById(id + "q").innerText = updated.data().quantity;
        }
      });
    });
  });
}

// "Remove" button handler.
function removeClick(id) {
  db.collection("cart").doc(id).delete().then();
  document.getElementById(id).remove();
}

// "Plus" button handler. Increments quantity.
function plusClick(id) {
  const increment = firebase.firestore.FieldValue.increment(1);
  db.collection("cart").doc(id).update({
    quantity: increment
  });
}

// "Minus" button handler. Decrements quantity.
function minusClick(id) {
  const decrement = firebase.firestore.FieldValue.increment(-1);
  db.collection("cart").doc(id).update({
    quantity: decrement
  });
}

// If cart size is greater than 0, enable proceed button. Else, disable it.
function checkIfCartEmpty(cs) {
  if (cs > 0) {
    $("footer a").removeClass("disabled");
  } else {
    $("footer a").addClass("disabled");
  }
}