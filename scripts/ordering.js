// The department div.
const department = document.querySelector("#department");
var urlParams = new URLSearchParams(window.location.search);
//get query sting for department
var depart = urlParams.get('department');
if (depart==""){depart=null;}
//get query sting for sort order
var sort = urlParams.get('sort');
var selID=document.getElementById("ddSortBy");
//set sort by dropdown from the query string
if (sort!=null )
{
selID.value=sort;
}

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

//for the cart generic variable
var vCartCount = 0;


//////////////////////////////
// Sends each document (item) in the cart to renderItem().
var selID=document.getElementById("ddSortBy");
var selectedSort=selID.options[selID.selectedIndex].value;

//sort items based on the user selection from the Sort By dropdown
switch(selectedSort)
{
  case "alphaAsc":
  
    db.collection("items")
    //.where("name",txt)
    .orderBy("name", "asc").get().then(snap => {
      snap.forEach(doc => {
        renderItem(doc);
        
      });
    });
    break;
    case "alphaDesc":
      db.collection("items").orderBy("name", "desc").get().then(snap => {
        snap.forEach(doc => {
          renderItem(doc);
          
        });
      });
    break;
    case "priceLow":
      db.collection("items").orderBy("price", "asc").get().then(snap => {
        snap.forEach(doc => {
          renderItem(doc);
          
        });
      });
    break;
    case "priceHigh":
      db.collection("items").orderBy("price", "desc").get().then(snap => {
        snap.forEach(doc => {
          renderItem(doc);
          
        });
      });
    break;

  default:
    db.collection("items").orderBy("name", "desc").get().then(snap => {
    snap.forEach(doc => {
      renderItem(doc);
      
    });
  });
}


///////////////////////////
// Renders each item in the cart.
function renderItem(doc) {

  let lblCart = document.getElementById("lblCart");
  let quantity = document.createElement("input");
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
 
  let minus = document.createElement("button");
  let addToCart = document.createElement("button");


//add to cart code
  lblCart.innerHTML = "";
  lblCart.visibility='visible';
  if (userLoggedIn) {
            
    user.collection("cart").doc(doc.id).get().then(snap => {
      if (snap.exists) {
        quantity.value = snap.data().quantity;
        
        if (quantity.value > 0) {
          
          vCartCount = parseInt(quantity.value) + vCartCount;
      
          lblCart.innerHTML = vCartCount;
    
        }
        
      }
    } )
  }
  //end of add to cart
  if (doc.data().department == depart || depart == null) {
    let img_name = doc.data().img_name;
    let n = doc.data().name;
    let p = doc.data().price;
  


    
    //lblCart.innerHTML = "";
    
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
    bottomRow.classList.add("row", "h-50", "justify-content-between", "align-items-center");
    priceCol.classList.add("col-auto");
    quantityCol.classList.add("col-9", "d-flex", "justify-content-between", "align-items-center", "w-5");
    quantity.size = 1;
    

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
        
        if (lblCart.innerHTML !='')
        {
           lblCart.innerHTML =   parseInt(lblCart.innerHTML) + 1;
           lblCart.style.visibility='visible';
        }

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
        if (lblCart.innerHTML !='')
        {
           lblCart.innerHTML =   parseInt(lblCart.innerHTML) + 1;
           lblCart.style.visibility='visible';
           
        }

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
        //update cart
        if (lblCart.value !='')
        {
           lblCart.innerHTML =   parseInt(lblCart.innerHTML) - 1;
           lblCart.style.visibility='visible';
        }
        if (lblCart.innerHTML =='0')
        {
           lblCart.style.visibility='hidden';
        } 
        else{lblCart.style.visibility='visible';}
    
        
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

//when user selects Sort By, call page again by passing sort and department in a query string so that we can order items from the database
$("#ddSortBy").on("change", event => {
      var selID=document.getElementById("ddSortBy");
      var selectedSort=selID.options[selID.selectedIndex].value;
      var strUrl = "";
      
      if(depart==null||depart=="")
      {
        strUrl = "Ordering.html?";
      }
      else{
        strUrl = "Ordering.html?department=" + depart + "&";
      }
    
      switch(selectedSort)
      {
        case "alphaAsc":
          strUrl = strUrl + "sort=alphaAsc";
          window.open(strUrl,"_self");
          break;
          case "alphaDesc":
            strUrl = strUrl + "sort=alphaDesc";
            window.open(strUrl,"_self");
        
          break;
          case "priceLow":
            strUrl = strUrl + "sort=priceLow";
          window.open(strUrl,"_self");
      
          break;
          case "priceHigh":
            strUrl = strUrl + "sort=priceHigh";
          window.open(strUrl,"_self");
          
          break;
      
        default:
          strUrl = strUrl + "sort=alphaAsc";
          window.open(strUrl,"_self");
      }

});
