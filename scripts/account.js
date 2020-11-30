//---------------------------------------------------
// This function checks to see if the user is sign in.
// If so, then you can go to the "users" collection,
// look for this person's document id (which would be authentication 
// object ("user")'s uid, and get that document.
// Now you can grab the name, or give a personalized greeting :)
//----------------------------------------------------
function getUser(){
    firebase.auth().onAuthStateChanged(function (user) {
        if (user){
            console.log ("user is signed in");
            db.collection("users")
            .doc(user.uid)
            .get()
            .then(function(doc){
                var n = doc.data().full_name;
                console.log(n);
                $("#username").text(n);
            })
        }
        else {
            console.log ("no user is signed in");
        }
    })
}

//reads the users database and prints onto the profile page
function readPhone() {
    db.collection("users").doc("kma6w6uPsaMdFPmi4C6gCicJD6w2")
    .onSnapshot(function(snap) {
        console.log(snap.data()); //print the document fields of the user
        console.log(snap.data().phone_no);
        document.getElementById("phone").innerText = snap.data().phone_no;
    })
}
 
readPhone();

function readEMail() {
    db.collection("users").doc("kma6w6uPsaMdFPmi4C6gCicJD6w2")
    .onSnapshot(function(snap) {
        console.log(snap.data()); //print the document fields of the user
        console.log(snap.data().email);
        document.getElementById("email").innerText = snap.data().email;
    })
}
 
readEMail();

function readEMail2() {
    db.collection("users").doc("kma6w6uPsaMdFPmi4C6gCicJD6w2")
    .onSnapshot(function(snap) {
        console.log(snap.data()); //print the document fields of the user
        console.log(snap.data().email);
        document.getElementById("email2").innerText = snap.data().email;
    })
}
 
readEMail2();

function readFullName() {
    db.collection("users").doc("kma6w6uPsaMdFPmi4C6gCicJD6w2")
    .onSnapshot(function(snap) {
        console.log(snap.data()); //print the document fields of the user
        console.log(snap.data().full_name);
        document.getElementById("fullName").innerText = snap.data().full_name;
    })
}
 
readFullName();

function readFullName2() {
    db.collection("users").doc("kma6w6uPsaMdFPmi4C6gCicJD6w2")
    .onSnapshot(function(snap) {
        console.log(snap.data()); //print the document fields of the user
        console.log(snap.data().full_name);
        document.getElementById("fullName2").innerText = snap.data().full_name;
    })
}
 
readFullName2();

function readAddress() {
    db.collection("users").doc("kma6w6uPsaMdFPmi4C6gCicJD6w2")
    .onSnapshot(function(snap) {
        console.log(snap.data()); //print the document fields of the user
        console.log(snap.data().address_line);
        document.getElementById("address").innerText = snap.data().address_line;
    })
}
 
readAddress();

function readAccId() {
    db.collection("users").doc("kma6w6uPsaMdFPmi4C6gCicJD6w2")
    .onSnapshot(function(snap) {
        console.log(snap.data()); //print the document fields of the user
        console.log(snap.data().account_id);
        document.getElementById("accID").innerText = snap.data().account_id;
    })
}
 
readAccId();

