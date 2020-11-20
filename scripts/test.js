// The department div.
const department = document.querySelector("#department");

// Renders each item in the cart.
function renderItem(doc) {
  let img_name = doc.data().img_name;
  let n = doc.data().name;
  let p = doc.data().price;

  let itemDiv = document.createElement("div");
  let img = document.createElement("img");
  let name = document.createElement("h5");
  let price = document.createElement("span");
  let plus = document.createElement("button");
  let minus = document.createElement("button");
  let quantity = document.createElement("span");

  db.collection("cart").doc(doc.id).get().then(snap => {
    if (snap.exists) {
      quantity.textContent = snap.data().quantity;
    } else {
      quantity.textContent = 0;
    }
  });

  itemDiv.setAttribute("data-id", doc.id);
  itemDiv.classList.add("d-flex", "flex-row", "align-items-center", "border-bottom", "border-primary");
  img.classList.add("img-fluid", "img-thumbnail");
  img.src = "images/" + img_name;
  img.alt = n;
  name.classList.add("d-flex", "justify-content-between");
  name.textContent = n;

  price.textContent = "$" + p;

  plus.classList.add("btn", "btn-primary");
  plus.textContent = "+";
  minus.classList.add("btn", "btn-primary");
  minus.textContent = "−";

  itemDiv.appendChild(img);
  itemDiv.appendChild(name);
  itemDiv.appendChild(price);
  itemDiv.appendChild(plus);
  itemDiv.appendChild(quantity);
  itemDiv.appendChild(minus);

  department.appendChild(itemDiv);

  // "Plus" button handler. Increments quantity.
  plus.addEventListener("click", event => {
    let id = itemDiv.getAttribute("data-id");
    const increment = firebase.firestore.FieldValue.increment(1);
    db.collection("cart").doc(id).get().then(snap => {
      if (snap.exists) {
        // Increment quantity.
        db.collection("cart").doc(id).update({
          quantity: increment
        });
      } else {
        // Add the item to the cart.
        db.collection("cart").doc(id).set({
          img_name: img_name,
          name: n,
          price: p,
          quantity: 1
        });
      }
    });
  });

  // "Minus" button handler. Decrements quantity.
  minus.addEventListener("click", event => {
    let id = itemDiv.getAttribute("data-id");
    const decrement = firebase.firestore.FieldValue.increment(-1);
    db.collection("cart").doc(id).get().then(snap => {
      if(snap.exists) {
        db.collection("cart").doc(id).update({
          quantity: decrement
        });
      }
    });
  });

  // Whenever the doc is updated (only quantity), do something.
  db.collection("cart").doc(doc.id).onSnapshot(updated => {
    if (updated.exists) {
      if (updated.data().quantity == 0) {
        db.collection("cart").doc(doc.id).delete();
      }
      quantity.textContent = updated.data().quantity;
    }
  });

}

// Sends each document (item) in the cart to renderItem().
db.collection("items").get().then(snap => {
  snap.forEach(doc => {
    renderItem(doc);
  });
});
