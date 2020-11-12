// "Confirm Payment" button handler.
$("#confirmPayment").on("click", function(event) {
  if (document.getElementById("mastercard").checked) {
    db.collection("accounts").doc("EthanWinters").update({
      card_type: "mastercard"
    });
  } else if (document.getElementById("visa").checked) {
    db.collection("accounts").doc("EthanWinters").update({
      card_type: "visa"
    });
  }
  db.collection("accounts").doc("EthanWinters").update({
    card_no: parseInt(document.getElementById("cardNumber").value),
    card_exp: parseInt(document.getElementById("cardExpiry").value),
    card_cvv: parseInt(document.getElementById("cvv").value)
  });
});
