function loadNavbar() {
    fetch('layout/navbar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('navbar-placeholder').innerHTML = data;

            // Add the event listener for the hamburger menu after the navbar is loaded
            document.querySelector('.navbar-toggle').addEventListener('click', function() {
                document.querySelector('.dropdown-menu').classList.toggle('show');
            });

            // Add the event listener for the search form
            document.getElementById('search-form').addEventListener('submit', function(event) {
                event.preventDefault();
                const query = document.getElementById('search-input').value;
                fetchSearchResults(query);
            });

            // Add event listener for search input for live search
            document.getElementById('search-input').addEventListener('input', function(event) {
                const query = event.target.value;
                if (query) {
                    fetchSearchResults(query);
                } else {
                    clearSearchResults();
                }
            });
        })
        .catch(error => console.error('Error loading navbar:', error));
}

function fetchSearchResults(query) {
    fetch('api/travel_recommendation_api.json')
        .then(response => response.json())
        .then(data => {
            displaySearchResults(query, data);
        })
        .catch(error => console.error('Error fetching search results:', error));
}

function displaySearchResults(query, data) {
    const resultsContainer = document.getElementById('search-results-dropdown');
    resultsContainer.innerHTML = ''; // Clear previous results

    let resultsFound = false;

    if (query.toLowerCase() === 'countries') {
        data.countries.forEach(country => {
            country.cities.forEach(city => {
                resultsContainer.appendChild(createResultCard(city));
                resultsFound = true;
            });
        });
    } else if (query.toLowerCase() === 'temples') {
        data.temples.forEach(temple => {
            resultsContainer.appendChild(createResultCard(temple));
            resultsFound = true;
        });
    } else if (query.toLowerCase() === 'beaches') {
        data.beaches.forEach(beach => {
            resultsContainer.appendChild(createResultCard(beach));
            resultsFound = true;
        });
    }

    if (!resultsFound) {
        resultsContainer.innerText = 'No results found for your query.';
    }

    resultsContainer.style.display = 'block';
}

function createResultCard(item) {
    const card = document.createElement('div');
    card.className = 'result-card';

    const img = document.createElement('img');
    img.src = item.imageUrl;
    img.alt = item.name;
    card.appendChild(img);

    const name = document.createElement('h2');
    name.innerText = item.name;
    card.appendChild(name);

    const description = document.createElement('p');
    description.innerText = item.description;
    card.appendChild(description);

    return card;
}

function clearSearchResults() {
    const resultsContainer = document.getElementById('search-results-dropdown');
    resultsContainer.innerHTML = '';
    resultsContainer.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', loadNavbar);
