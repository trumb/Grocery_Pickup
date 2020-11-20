// The size of the cart. Number of items in the cart.
var cartSize = 0;

// The cart div.
const cart = document.querySelector("#cart");

// Renders each item in the cart.
function renderItem(doc) {
  cartSize++;
  let img_name = doc.data().img_name;
  let n = doc.data().name;
  let p = doc.data().price;
  let q = doc.data().quantity;

  let itemDiv = document.createElement("div");
  let img = document.createElement("img");
  let name = document.createElement("h5");
  let remove = document.createElement("button");
  let price = document.createElement("span");
  let plus = document.createElement("button");
  let quantity = document.createElement("span");
  let minus = document.createElement("button");

  itemDiv.setAttribute("data-id", doc.id);
  itemDiv.classList.add("d-flex", "flex-row", "align-items-center", "border-bottom", "border-primary");
  img.classList.add("img-fluid", "img-thumbnail");
  img.src = "images/" + img_name;
  img.alt = n;
  name.classList.add("d-flex", "justify-content-between");
  name.textContent = n;

  price.textContent = "$" + p;
  quantity.textContent = q;

  remove.classList.add("btn", "btn-primary");
  remove.textContent = "×";
  plus.classList.add("btn", "btn-primary");
  plus.textContent = "+";
  minus.classList.add("btn", "btn-primary");
  minus.textContent = "−";

  itemDiv.appendChild(img);
  itemDiv.appendChild(name);
  itemDiv.appendChild(remove);
  itemDiv.appendChild(price);
  itemDiv.appendChild(plus);
  itemDiv.appendChild(quantity);
  itemDiv.appendChild(minus);

  cart.appendChild(itemDiv);

  // Remove (×) button handler. Removes item from cart.
  remove.addEventListener("click", event => {
    event.stopPropagation();
    let id = event.target.parentElement.getAttribute("data-id");
    db.collection("cart").doc(id).update({
      quantity: 0
    });
  });

  // "Plus" button handler. Increments quantity.
  plus.addEventListener("click", event => {
    let id = itemDiv.getAttribute("data-id");
    const increment = firebase.firestore.FieldValue.increment(1);
    db.collection("cart").doc(id).update({
      quantity: increment
    });
  });

  // "Minus" button handler. Decrements quantity.
  minus.addEventListener("click", event => {
    let id = itemDiv.getAttribute("data-id");
    const decrement = firebase.firestore.FieldValue.increment(-1);
    db.collection("cart").doc(id).update({
      quantity: decrement
    });
  });

  db.collection("cart").doc(doc.id).onSnapshot(updated => {
    if (cartSize != 0) {
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

// Sends each document (item) in the cart to renderItem().
db.collection("cart").get().then(snap => {
  snap.forEach(doc => {
    renderItem(doc);
  });
  checkIfCartEmpty(cartSize);
});

// Deletes the reference and removes the itemDiv from the cart.
function removeItem(itemDiv) {
  let id = itemDiv.getAttribute("data-id");
  db.collection("cart").doc(id).delete();
  itemDiv.remove();
  cartSize--;
  checkIfCartEmpty(cartSize);
}

// "Empty Cart" button handler.
$("#empty").on("click", event => {
  db.collection("cart").get().then(snap => {
    snap.forEach(function(doc) {
      db.collection("cart").doc(doc.id).update({
        quantity: 0
      });
    });
  });
});

// If cart size is greater than 0, enable proceed button. Else, disable it.
function checkIfCartEmpty(cs) {
  if (cs > 0) {
    $("footer a").removeClass("disabled");
  } else {
    $("footer a").addClass("disabled");
  }
}
