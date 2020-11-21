// The department div.
const department = document.querySelector("#department");

// The current user, if logged in. Otherwise, null.
var userLoggedIn;

// If logged in, sets user to the logged-in user's document.
var user;
auth.onAuthStateChanged(token => {
  if (token) {
    userLoggedIn = token;
    user = db.collection("users").doc(token.uid);
  }
});

// Renders each item in the cart.
function renderItem(doc) {
  let img_name = doc.data().img_name;
  let n = doc.data().name;
  let p = doc.data().price;

  let itemDiv = document.createElement("div");
  let itemInfo = document.createElement("div");
  let img = document.createElement("img");
  let name = document.createElement("h4");
  let topRow = document.createElement("div");
  let nameCol = document.createElement("div");
  let bottomRow = document.createElement("div");
  let priceCol = document.createElement("div");
  let price = document.createElement("h5");
  let quantityCol = document.createElement("div");
  let plus = document.createElement("button");
  let quantity = document.createElement("h5");
  let minus = document.createElement("button");

  // If the user is logged in and an item in their cart matches the item document,
  // set the quantity on this page to match their cart's quantity.
  if (userLoggedIn) {
    user.collection("cart").doc(doc.id).get().then(snap => {
      if (snap.exists) {
        quantity.textContent = snap.data().quantity;
      } else {
        quantity.textContent = 0;
      }
    });
  } else {
    quantity.textContent = 0;
  }
  
  itemDiv.setAttribute("data-id", doc.id);
  itemDiv.classList.add("d-flex", "flex-row", "border-bottom", "border-primary");
  itemInfo.classList.add("container");
  topRow.classList.add("row", "justify-content-between");
  nameCol.classList.add("col-auto");
  bottomRow.classList.add("row", "h-50", "justify-content-between", "align-items-end");
  priceCol.classList.add("col-auto");
  quantityCol.classList.add("col-5", "d-flex", "justify-content-between", "align-items-center");

  img.classList.add("img-fluid", "img-thumbnail");
  img.src = "images/" + img_name;
  img.alt = n;
  name.textContent = n;

  price.textContent = "$" + p;

  plus.classList.add("btn", "btn-primary");
  plus.textContent = "+";
  minus.classList.add("btn", "btn-primary");
  minus.textContent = "−";

  itemDiv.append(img, itemInfo);
  itemInfo.append(topRow, bottomRow);
  topRow.append(nameCol);
  nameCol.append(name);
  bottomRow.append(priceCol, quantityCol);
  priceCol.append(price);
  quantityCol.append(plus, quantity, minus);

  department.appendChild(itemDiv);

  // "Plus" button handler. Increments quantity if user is logged in.
  plus.addEventListener("click", event => {
    if (userLoggedIn) {
      const increment = firebase.firestore.FieldValue.increment(1);
      user.collection("cart").doc(doc.id).get().then(snap => {
        if (snap.exists) {
          // Increment quantity.
          user.collection("cart").doc(doc.id).update({
            quantity: increment
          });
        } else {
          // Add the item to the cart.
          user.collection("cart").doc(doc.id).set({
            img_name: img_name,
            name: n,
            price: p,
            quantity: 1
          });
        }
      });
    }
  });

  // "Minus" button handler. Decrements quantity.
  minus.addEventListener("click", event => {
    const decrement = firebase.firestore.FieldValue.increment(-1);
    if (userLoggedIn) {
      user.collection("cart").doc(doc.id).get().then(snap => {
        if(snap.exists) {
          user.collection("cart").doc(doc.id).update({
            quantity: decrement
          });
        }
      });
    }
  });

  // Whenever the doc is updated (only quantity), do something.
  if (userLoggedIn) {
    user.collection("cart").doc(doc.id).onSnapshot(updated => {
      if (updated.exists) {
        if (updated.data().quantity == 0) {
          user.collection("cart").doc(doc.id).delete();
        }
        quantity.textContent = updated.data().quantity;
      }
    });
  }
}

// Sends each document (item) in the cart to renderItem().
db.collection("items").get().then(snap => {
  snap.forEach(doc => {
    renderItem(doc);
  });
});
