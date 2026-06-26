// ================================
// MOBILE MENU
// ================================

const menuBtn = document.querySelector(".menu-btn");
const navLinks = document.querySelector(".nav-links");

menuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("show");
});


// ================================
// CONTACT FORM
// ================================

const contactForm = document.getElementById("contact-form");
const message = document.getElementById("form-message");

contactForm.addEventListener("submit", function (e) {

    e.preventDefault();

    message.textContent = "Thank you! Your message has been sent successfully.";

    message.style.color = "#16a34a";

    contactForm.reset();

});