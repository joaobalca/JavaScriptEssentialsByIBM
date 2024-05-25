// scripts.js
function loadNavbar() {
    fetch('./layout/navbar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('navbar-placeholder').innerHTML = data;

            // Add the event listener for the hamburger menu after the navbar is loaded
            document.querySelector('.navbar-toggle').addEventListener('click', function() {
                document.querySelector('.dropdown-menu').classList.toggle('show');
            });
        });
}

document.addEventListener('DOMContentLoaded', loadNavbar);
