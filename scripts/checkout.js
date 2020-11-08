var cartSize = 0;

$(document).ready(function() {
  createCart();
});

$("#empty").on("click", function(event) {
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
      console.log(cartSize);
      var id = doc.id;
      var n = doc.data().name;
      var p = doc.data().price;
      var img = doc.data().img_name;
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
    });
  });
}

function removeClick(id) {
  db.collection("cart").doc(id).delete().then();
  document.getElementById(id).remove();
}

function plusClick(id) {
  const increment = firebase.firestore.FieldValue.increment(1);
  db.collection("cart").doc(id).update({
    quantity: increment
  });
  db.collection("cart").doc(id).onSnapshot(function(updated) {
    document.getElementById(id + "q").innerText = updated.data().quantity;
  });
}

function minusClick(id) {
  const decrement = firebase.firestore.FieldValue.increment(-1);
  db.collection("cart").doc(id).update({
    quantity: decrement
  });
  db.collection("cart").doc(id).onSnapshot(function(updated) {
    document.getElementById(id + "q").innerText = updated.data().quantity;
  });
}

function checkIfCartEmpty(cs) {
  if (cs > 0) {
    $("footer a").removeClass("disabled");
  } else {
    $("footer a").addClass("disabled");
  }
}

/*async getMarker() {
    const snapshot = await firebase.firestore().collection('events').get()
    return snapshot.docs.map(doc => doc.data());
}
*/
