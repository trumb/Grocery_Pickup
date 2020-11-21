// "Confirm Payment" button handler.

db.settings({
  timestampsInSnapshots: true
});
const form = document.querySelector("#payment");

form.addEventListener("submit", event => {
  event.preventDefault();
  if (document.getElementById("mastercard").checked) {
    db.collection("users").doc("EthanWinters").update({
      card_type: "mastercard"
    });
  } else if (document.getElementById("visa").checked) {
    db.collection("users").doc("EthanWinters").update({
      card_type: "visa"
    });
  }
  db.collection("users").doc("EthanWinters").update({
    card_no: parseInt(form.number.value),
    card_exp: parseInt(form.expiry.value),
    card_cvv: parseInt(form.cvv.value)
  });
  form.reset();
  $("#continue").removeClass("disabled");
});
