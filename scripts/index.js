
var slideIndex = 0;
    showSlides();

    function showSlides() {
      var i;
      var slides = document.getElementsByClassName("mySlides");
      var dots = document.getElementsByClassName("dot");
      for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
      }
      slideIndex++;
      if (slideIndex > slides.length) {slideIndex = 1}
      for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active1", "");
      }
      slides[slideIndex-1].style.display = "block";
      dots[slideIndex-1].className += " active1";
      setTimeout(showSlides, 4000); // Change image every 2 seconds
    }

    const login = document.querySelector("#login");
    const signOut = document.querySelector("#signOut");
    login.addEventListener("submit", event => {
      event.preventDefault();
      const email = login.email.value;
      const password = login.password.value;

      auth.signInWithEmailAndPassword(email, password).then(account => {
        console.log(account.user.uid);
      });
    });

    signOut.addEventListener("click", event => {
      event.preventDefault();
      auth.signOut();
      console.log("User signed out");
    });
