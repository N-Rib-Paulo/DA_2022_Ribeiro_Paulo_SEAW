// Header - Responsive Navbar (Button)
const toggleButton = document.getElementsByClassName('toggle-button')[0];
const navbarLinks = document.getElementsByClassName('navbar-links')[0];

toggleButton.addEventListener('click', () => {
    navbarLinks.classList.toggle('active');
});

// POPUP - Kontaktformular, Anmeldung etc.
let popup = document.getElementById("popup");

function openPopup() {
        popup.classList.add("open-popup");
}

function openPopupReg() {
    popup.classList.add("open-popup");
}


