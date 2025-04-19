// Global variables to store destination data
let manualCityData = {};

// Function to search destinations
function searchDestinations() {
    console.log('Search function called');
    const query = document.getElementById('search-bar').value.trim();
    if (!query) {
        alert('Please enter a city name to search');
        return;
    }

    const searchResults = document.getElementById('search-results');
    searchResults.innerHTML = '<p>Searching...</p>';
    searchResults.style.display = 'block';

    // Hide destinations list if it's visible
    const destinationsList = document.getElementById('destinations-list');
    if (destinationsList) {
        destinationsList.style.display = 'none';
    }

    // Load the manual_indian_city_places.json file with absolute path
    fetch('manual_indian_city_places.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Successfully loaded city data:', Object.keys(data).length, 'cities');
            manualCityData = data;

            // Search for matching cities
            const matchingCities = [];
            for (const cityName in manualCityData) {
                if (cityName.toLowerCase().includes(query.toLowerCase())) {
                    matchingCities.push({
                        name: cityName,
                        image: manualCityData[cityName].image ||
                               (manualCityData[cityName].places && manualCityData[cityName].places.length > 0 ?
                                manualCityData[cityName].places[0].image : null)
                    });
                }
            }

            // Display search results
            if (matchingCities.length === 0) {
                searchResults.innerHTML = '<p>No cities found matching your search.</p>';
                return;
            }

            let html = '<h3>Search Results</h3><div class="search-results-grid">';

            matchingCities.forEach(city => {
                const cityImage = city.image || 'https://via.placeholder.com/640x360?text=' + encodeURIComponent(city.name);

                html += `
                    <div class="destination-card">
                        <div class="destination-image">
                            <img src="${cityImage}" alt="${city.name}">
                        </div>
                        <div class="destination-info">
                            <h3>${city.name}</h3>
                            <p>Explore the beautiful city of ${city.name} and its famous attractions.</p>
                            <a href="destination_details.html?name=${encodeURIComponent(city.name)}" class="view-details-btn">View Details</a>
                        </div>
                    </div>
                `;
            });

            html += '</div>';
            searchResults.innerHTML = html;
        })
        .catch(error => {
            console.error('Error loading city data:', error);
            console.error('Error details:', error.message);
            searchResults.innerHTML = `<p>Error loading city data: ${error.message}. Please try again later.</p>`;
        });
}

// Initialize when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Set up search functionality
    const searchBtn = document.getElementById('search-btn');
    const searchBar = document.getElementById('search-bar');

    if (searchBtn) {
        searchBtn.addEventListener('click', searchDestinations);
    }

    if (searchBar) {
        searchBar.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchDestinations();
            }
        });
    }

    // Remove any existing reset button
    const resetBtn = document.getElementById('reset-search');
    if (resetBtn) {
        resetBtn.parentNode.removeChild(resetBtn);
    }

    // Clear the destinations list
    const destinationsList = document.getElementById('destinations-list');
    if (destinationsList) {
        destinationsList.innerHTML = '';
    }
});
