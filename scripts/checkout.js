// The size of the cart. Number of items in the cart.
var cartSize = 0;

// References the currently logged in user's document (if logged in).
var user;

// The cart div.
const cart = document.querySelector("#cart");

// Renders each item in the cart.
function renderItem(doc) {
  let img_name = doc.data().img_name;
  let n = doc.data().name;
  let p = doc.data().price;
  let q = doc.data().quantity;

  let itemDiv = document.createElement("div");
  let itemInfo = document.createElement("div");
  let img = document.createElement("img");
  let name = document.createElement("h4");
  let topRow = document.createElement("div");
  let nameCol = document.createElement("div");
  let removeCol = document.createElement("div");
  let remove = document.createElement("button");
  let bottomRow = document.createElement("div");
  let priceCol = document.createElement("div");
  let price = document.createElement("h5");
  let quantityCol = document.createElement("div");
  let plus = document.createElement("button");
  let quantity = document.createElement("h5");
  let minus = document.createElement("button");

  itemDiv.setAttribute("data-id", doc.id);
  itemDiv.classList.add("d-flex", "flex-row", "border-bottom", "border-primary");
  itemInfo.classList.add("container");
  topRow.classList.add("row", "justify-content-between");
  nameCol.classList.add("col-auto");
  removeCol.classList.add("col-auto");
  bottomRow.classList.add("row", "h-50", "justify-content-between", "align-items-end");
  priceCol.classList.add("col-auto");
  quantityCol.classList.add("col-5", "d-flex", "justify-content-between", "align-items-center");

  img.classList.add("img-fluid", "img-thumbnail");
  img.src = "images/" + img_name;
  img.alt = n;
  name.textContent = n;

  price.textContent = "$" + p;
  quantity.textContent = q;

  remove.classList.add("btn", "btn-primary");
  remove.textContent = "×";
  plus.classList.add("btn", "btn-primary");
  plus.textContent = "+";
  minus.classList.add("btn", "btn-primary");
  minus.textContent = "−";

  itemDiv.append(img, itemInfo);
  itemInfo.append(topRow, bottomRow);
  topRow.append(nameCol, removeCol);
  nameCol.append(name);
  removeCol.append(remove);
  bottomRow.append(priceCol, quantityCol);
  priceCol.append(price);
  quantityCol.append(plus, quantity, minus);

  cart.appendChild(itemDiv);

  // Remove (×) button handler. Removes item from cart.
  remove.addEventListener("click", event => {
    event.stopPropagation();
    user.collection("cart").doc(doc.id).update({
      quantity: 0
    });
  });

  // "Plus" button handler. Increments quantity.
  plus.addEventListener("click", event => {
    const increment = firebase.firestore.FieldValue.increment(1);
    user.collection("cart").doc(doc.id).update({
      quantity: increment
    });
  });

  // "Minus" button handler. Decrements quantity.
  minus.addEventListener("click", event => {
    const decrement = firebase.firestore.FieldValue.increment(-1);
    user.collection("cart").doc(doc.id).update({
      quantity: decrement
    });
  });

  user.collection("cart").doc(doc.id).onSnapshot(updated => {
    if (cartSize > 0) {
      if (updated.exists) {
        if (updated.data().quantity == 0) {
          removeItem(itemDiv);
        } else {
          quantity.textContent = updated.data().quantity;
        }
      }
    }
  });
}

// Sends each document (item) in the user's cart to renderItem() (if logged in).
auth.onAuthStateChanged(token => {
  if (token) {
    user = db.collection("users").doc(token.uid);
    user.collection("cart").get().then(snap => {
      snap.forEach(doc => {
        cartSize++;
        renderItem(doc);
      });
      checkIfCartEmpty(cartSize);
    });
  }
});

// Deletes the reference and removes the itemDiv from the page.
function removeItem(itemDiv) {
  let id = itemDiv.getAttribute("data-id");
  user.collection("cart").doc(id).delete();
  itemDiv.remove();
  cartSize--;
  checkIfCartEmpty(cartSize);
}

// "Empty Cart" button handler.
$("#empty").on("click", event => {
  if(user) {
    user.collection("cart").get().then(snap => {
      snap.forEach(doc => {
        user.collection("cart").doc(doc.id).update({
          quantity: 0
        });
      });
    });
  }
});

// If cart size is greater than 0, enable proceed button. Else, disable it.
function checkIfCartEmpty(cs) {
  if (cs > 0) {
    $("footer a").removeClass("disabled");
  } else {
    $("footer a").addClass("disabled");
  }
}
