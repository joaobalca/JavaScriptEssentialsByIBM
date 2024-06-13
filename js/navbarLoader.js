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

            // Add event listener for the clear button
            document.querySelector('.clear-button').addEventListener('click', function() {
                clearSearch();
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

    if (query.toLowerCase() === 'country') {
        data.country.forEach(country => {
            country.cities.forEach(city => {
                resultsContainer.appendChild(createResultCard(city));
                resultsFound = true;
            });
        });
    } else if (query.toLowerCase() === 'temple') {
        data.temple.forEach(temple => {
            resultsContainer.appendChild(createResultCard(temple));
            resultsFound = true;
        });
    } else if (query.toLowerCase() === 'beach') {
        data.beach.forEach(beach => {
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

    const content = document.createElement('div');
    content.className = 'result-content';

    const name = document.createElement('h2');
    name.innerText = item.name; // Ensure the name is correctly assigned
    content.appendChild(name);

    const description = document.createElement('p');
    description.innerText = item.description;
    content.appendChild(description);

    const localTime = document.createElement('p');
    localTime.className = 'local-time';
    localTime.innerText = 'Loading local time...';
    content.appendChild(localTime);

    // Fetch and update local time
    fetchLocalTime(item, localTime);

    card.appendChild(content);

    return card;
}

function fetchLocalTime(item, localTimeElement) {
    const timezones = {
        "Sydney, Australia": "Australia/Sydney",
        "Melbourne, Australia": "Australia/Melbourne",
        "Tokyo, Japan": "Asia/Tokyo",
        "Kyoto, Japan": "Asia/Tokyo",
        "Rio de Janeiro, Brazil": "America/Sao_Paulo",
        "São Paulo, Brazil": "America/Sao_Paulo",
        "Angkor Wat, Cambodia": "Asia/Phnom_Penh",
        "Taj Mahal, India": "Asia/Kolkata",
        "Bora Bora, French Polynesia": "Pacific/Tahiti",
        "Copacabana Beach, Brazil": "America/Sao_Paulo"
    };

    const timezone = timezones[item.name];
    if (timezone) {
        const localTime = moment().tz(timezone).format('MMMM Do YYYY, h:mm:ss a');
        localTimeElement.innerText = `Local Time: ${localTime}`;
    } else {
        localTimeElement.innerText = 'Local time not available';
    }
}

function clearSearch() {
    document.getElementById('search-input').value = '';
    clearSearchResults();
}

function clearSearchResults() {
    const resultsContainer = document.getElementById('search-results-dropdown');
    resultsContainer.innerHTML = '';
    resultsContainer.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', loadNavbar);
