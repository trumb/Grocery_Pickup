var order = localStorage.getItem("order");

$("#number").append(order);

// References the currently logged in user's document (if logged in).
var user;

// The cart div.
const recentOrder = document.querySelector("#recentOrder");

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
  let bottomRow = document.createElement("div");
  let priceCol = document.createElement("div");
  let price = document.createElement("h5");
  let quantityCol = document.createElement("div");
  let quantity = document.createElement("h5");

  itemDiv.setAttribute("data-id", doc.id);
  itemDiv.classList.add("d-flex", "flex-row", "border-bottom", "border-primary");
  itemInfo.classList.add("container");
  topRow.classList.add("row", "justify-content-between");
  nameCol.classList.add("col-auto");
  removeCol.classList.add("col-auto");
  bottomRow.classList.add("row", "h-50", "justify-content-between", "align-items-end");
  priceCol.classList.add("col-auto");
  quantityCol.classList.add("col-5", "d-flex", "justify-content-around", "align-items-center");

  img.classList.add("img-fluid", "img-thumbnail");
  img.src = "images/" + img_name;
  img.alt = n;
  name.textContent = n;

  price.textContent = "$" + p;
  quantity.textContent = q;

  itemDiv.append(img, itemInfo);
  itemInfo.append(topRow, bottomRow);
  topRow.append(nameCol, removeCol);
  nameCol.append(name);
  bottomRow.append(priceCol, quantityCol);
  priceCol.append(price);
  quantityCol.append("Quantity: ", quantity);

  recentOrder.appendChild(itemDiv);
}

// Sends each document (item) in the user's cart to renderItem() (if logged in).
auth.onAuthStateChanged(token => {
  if (token) {
    user = db.collection("users").doc(token.uid);
    user.collection("orders").doc(order).collection("cart").get().then(snap => {
      snap.forEach(doc => {
        renderItem(doc);
      });
    });
  }
});
