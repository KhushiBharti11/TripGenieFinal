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
    
    // Load the manual_indian_city_places.json file using XMLHttpRequest
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'manual_indian_city_places.json', true);
    
    xhr.onload = function() {
        if (xhr.status === 200) {
            try {
                const data = JSON.parse(xhr.responseText);
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
            } catch (error) {
                console.error('Error parsing JSON:', error);
                searchResults.innerHTML = `<p>Error parsing city data: ${error.message}. Please try again later.</p>`;
            }
        } else {
            console.error('Error loading city data. Status:', xhr.status);
            searchResults.innerHTML = `<p>Error loading city data. Status: ${xhr.status}. Please try again later.</p>`;
        }
    };
    
    xhr.onerror = function() {
        console.error('Network error while loading city data');
        searchResults.innerHTML = '<p>Network error while loading city data. Please check your connection and try again.</p>';
    };
    
    xhr.send();
}

// Initialize when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Destinations.js loaded');
    
    // Set up search functionality
    const searchBtn = document.getElementById('search-btn');
    const searchBar = document.getElementById('search-bar');
    
    if (searchBtn) {
        console.log('Search button found, adding event listener');
        searchBtn.addEventListener('click', searchDestinations);
    } else {
        console.error('Search button not found');
    }
    
    if (searchBar) {
        console.log('Search bar found, adding event listener');
        searchBar.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchDestinations();
            }
        });
    } else {
        console.error('Search bar not found');
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
    } else {
        console.error('Destinations list not found');
    }
});
