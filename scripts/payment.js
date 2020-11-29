// The current user, if logged in. Otherwise, null.
var userLoggedIn;

// If logged in, sets user to the logged-in user's document.
var user;

var card_type;

// Luhn test of credit card numbers.
// Pass credit card number. If it returns true, value MAY be valid.
var luhn10 = function(a, b, c, d, e) {
  for (d = +a[b = a.length - 1], e = 0; b--;)
    c = +a[b], d += ++e % 2 ? 2 * c % 10 + (c > 4) : c;
  return !(d % 10)
};

// I forget what this does. Maybe important.
db.settings({
  timestampsInSnapshots: true
});

// "Confirm Payment" button handler.
const form = document.querySelector("#payment");

form.addEventListener("submit", event => {
  event.preventDefault();
  if (userLoggedIn) {
    const cardNo = form.number.value;
    if (luhn10(cardNo)) {
      /*
        TODO: Check validity of the Mastercard/Visa card here.
      */
      if (document.getElementById("mastercard").checked) {
        card_type = "mastercard"
      } else if (document.getElementById("visa").checked) {
        card_type = "visa"
      }
      if (document.getElementById("remember").checked) {
        user.update({
          card_type: card_type,
          card_no: parseInt(form.number.value),
          expiry_month: parseInt(form.month.value),
          expiry_year: parseInt(form.year.value)
        });
      }
      createOrderRecord(form.number.value);
      form.reset();
      //location.href = "receipt.html"
      $("#continue").removeClass("disabled");
    } else {
      alert("Your card number was invalid. Please try again.");
    }
  }
});

// If logged in, check if user's payment data is saved, then autoinput relevant values.
auth.onAuthStateChanged(token => {
  if (token) {
    userLoggedIn = token;
    user = db.collection("users").doc(token.uid);
    user.get().then(snap => {
      if (snap.data().card_no) {
        form.number.value = snap.data().card_no;
      }
      if (snap.data().card_type) {
        if (snap.data().card_type == "mastercard") {
          document.getElementById("mastercard").checked = true;
        } else if (snap.data().card_type == "visa") {
          document.getElementById("visa").checked = true;
        }
      }
      if (snap.data().expiry_month) {
        form.month.value = snap.data().expiry_month;
      }
      if (snap.data().expiry_year) {
        form.year.value = snap.data().expiry_year;
      }
    });
  }
});

function createOrderRecord(cardNo) {
  var orderNo;
  db.collection("orders").get().then(snap => {
    var isInCollection = true;
    while (isInCollection) {
      // Generates an order number between 100,000 and 900,000.
      orderNo = Math.floor((Math.random() * 899999) + 100000);
      console.log(orderNo);
      var notFound = true;
      snap.forEach(doc => {
        if (doc.id == orderNo) {
          notFound = false;
        }
      });
      if (notFound) {
        isInCollection = false;
      }
    }
    db.collection("orders").doc("" + orderNo).set({
      user_id: userLoggedIn.uid
    });
    user.collection("orders").doc("" + orderNo).set({
      card_type: card_type,
      card_no: cardNo
    });
    localStorage.order = orderNo;
  });
  user.collection("cart").get().then(snap => {
    snap.forEach(doc => {
      user.collection("orders").doc("" + orderNo).collection("cart").doc(doc.id).set({
        name: doc.data().name,
        price: doc.data().price,
        quantity: doc.data().quantity
      });
      user.collection("cart").doc(doc.id).update({
        quantity: 0
      });
    });
  });
}
