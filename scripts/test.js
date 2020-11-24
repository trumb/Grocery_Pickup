// The department div.
const department = document.querySelector("#department");
var urlParams = new URLSearchParams(window.location.search);
var depart = urlParams.get('department');
//alert(urlParams.get('department'));
// The current user, if logged in. Otherwise, null.
var userLoggedIn;
/////////////


// If logged in, sets user to the logged-in user's document.
var user;
auth.onAuthStateChanged(token => {
  if (token) {
    userLoggedIn = token;
    user = db.collection("users").doc(token.uid);
  }
});


/////////makes nav bold
var currElem = null; //will hold the element that is bold now


//////////////////////////////
// Renders each item in the cart.
function renderItem(doc) {

  if (doc.data().department == depart || depart == null) {
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
    let quantity = document.createElement("input");
    let minus = document.createElement("button");
    let addToCart = document.createElement("button");


    // If the user is logged in and an item in their cart matches the item document,
    // set the quantity on this page to match their cart's quantity.
    if (!userLoggedIn) {
      quantityCol.style.visibility = "hidden";
    }
    if (userLoggedIn) {
      user.collection("cart").doc(doc.id).get().then(snap => {
        if (snap.exists) {
          quantity.value = snap.data().quantity;
          quantityCol.style.visibility = "visible";
          addToCart.style.visibility = "hidden";
        } else {
          quantity.value = 0;
          quantityCol.style.visibility = "hidden";
          addToCart.style.visibility = "visible";
        }
      });
    } else {
      quantity.value = 0;
    }
    // if(snap.data().department==Selection){
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
    addToCart.classList.add("btn", "btn-dark");
    addToCart.textContent = "Add to Cart";

    itemDiv.append(img, itemInfo);
    itemInfo.append(topRow, bottomRow, addToCart);
    topRow.append(nameCol);
    nameCol.append(name);
    bottomRow.append(priceCol, quantityCol, addToCart);
    priceCol.append(price);
    quantityCol.append(plus, quantity, minus);

    department.appendChild(itemDiv);
    //   }

    // "Plus" button handler. Increments quantity if user is logged in.
    plus.addEventListener("click", event => {


      const increment = firebase.firestore.FieldValue.increment(1);

      if (userLoggedIn) {
        user.collection("cart").doc(doc.id).get().then(snap => {
          if (snap.exists) {
            //alert(snap.data().quantity);
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

    // Add to Cart Button
    addToCart.addEventListener("click", event => {
      addToCart.style.visibility = "hidden";
      quantityCol.style.visibility = "visible";
      if (!userLoggedIn) {
        alert("Please sign in to add to cart")
      }
      if (userLoggedIn) {
        // const increment = firebase.firestore.FieldValue.increment(1);
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
          if (snap.exists) {
            user.collection("cart").doc(doc.id).update({
              quantity: decrement

            })
            if (snap.data().quantity == 1 || snap.data().quantity == 0) {
              addToCart.style.visibility = "visible";
              quantityCol.style.visibility = "hidden";
            }
          } else {
            addToCart.style.visibility = "visible";
          }
        });
      }
    });

    /////////////

    // "input" button handler. Decrements quantity.
    quantity.addEventListener("change", event => {


      if (userLoggedIn) {
        user.collection("cart").doc(doc.id).get().then(snap => {
          if (snap.exists) {

            if (snap.data().quantity == 0 || quantity.value == 0) {

              addToCart.style.visibility = "visible";
              quantityCol.style.visibility = "hidden";
            }
            user.collection("cart").doc(doc.id).update({
              quantity: parseInt(quantity.value),

            })
            if (snap.data().quantity == 0 || quantity.value == 0) {

              addToCart.style.visibility = "visible";
              quantityCol.style.visibility = "hidden";
            }
          } else {

            addToCart.style.visibility = "visible";
          }
        });
      }
    });

    ///////////////////

    // Whenever the doc is updated (only quantity), do something.
    if (userLoggedIn) {
      user.collection("cart").doc(doc.id).onSnapshot(updated => {
        if (updated.exists) {
          if (updated.data().quantity == 0) {
            user.collection("cart").doc(doc.id).delete();
          }
          quantity.value = updated.data().quantity;
        }
      });
    }
  }
}
// Sends each document (item) in the cart to renderItem().
db.collection("items").get().then(snap => {
  snap.forEach(doc => {
    renderItem(doc);
  });
});